
import { prisma } from '../server.js';
import { addMinutes, startOfDay, endOfDay, formatISO } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';

const FILE_DB = path.join(new URL('.', import.meta.url).pathname, '..', '..', 'data', 'bookings.json');

async function readFileBookings() {
    try {
        const txt = await fs.readFile(FILE_DB, 'utf-8');
        return JSON.parse(txt);
    } catch (e) {
        return [];
    }
}

async function writeFileBookings(arr) {
    try {
        await fs.mkdir(path.dirname(FILE_DB), { recursive: true });
        await fs.writeFile(FILE_DB, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (e) {
        console.error('Erro ao escrever bookings file', e);
    }
}

// 1. Criar um novo agendamento
export const createAppointment = async (req, res) => {
    const { date, serviceId } = req.body;
    const userId = req.userId; // Vem do AuthMiddleware

    if (!date || !serviceId) {
        return res.status(400).json({ error: 'Data e Serviço são obrigatórios.' });
    }
    
    const appointmentDate = new Date(date);

    try {
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            return res.status(404).json({ error: 'Serviço não encontrado.' });
        }

        const endTime = addMinutes(appointmentDate, service.duration);
        
        // Checa conflito de horário (simplificado para um barbeiro por enquanto)
        const conflict = await prisma.appointment.findFirst({
            where: {
                date: appointmentDate, // Verifica a data exata
            },
        });
        
        if (conflict) {
            return res.status(409).json({ error: 'Conflito de horário. O horário já está ocupado.' });
        }

        const newAppointment = await prisma.appointment.create({
            data: {
                date: appointmentDate,
                serviceId,
                userId,
                status: 'CONFIRMED', 
            },
            include: { service: { select: { name: true, price: true } } },
        });

        return res.status(201).json(newAppointment);

    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        return res.status(500).json({ error: 'Erro interno ao criar agendamento.' });
    }
};

// 2. Listar Agendamentos de um Usuário
export const getUserAppointments = async (req, res) => {
    const userId = req.userId;

    try {
        const appointments = await prisma.appointment.findMany({
            where: { userId },
            include: { service: { select: { name: true, duration: true } } },
            orderBy: { date: 'asc' },
        });
        return res.status(200).json(appointments);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno ao buscar agendamentos.' });
    }
};

// 3. Listar Horários Disponíveis em um dia
export const getAvailableSlots = async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ error: 'A data é obrigatória.' });
    }
    
    const targetDate = new Date(date);
    const startOfDayTime = startOfDay(targetDate);
    const endOfDayTime = endOfDay(targetDate);
    
    const workingHours = { start: 8, end: 18 };
    const slotDuration = 30; 

    try {
        const occupiedAppointments = await prisma.appointment.findMany({
            where: {
                date: { gte: startOfDayTime, lte: endOfDayTime },
                status: 'CONFIRMED',
            },
            include: { service: { select: { duration: true } } },
        });

        const occupiedSlots = new Set();
        occupiedAppointments.forEach(appt => {
            let current = appt.date;
            const end = addMinutes(current, appt.service.duration);
            while (current < end) {
                occupiedSlots.add(formatISO(current));
                current = addMinutes(current, slotDuration);
            }
        });
        
        const availableSlots = [];
        let currentTime = startOfDayTime;
        currentTime.setHours(workingHours.start, 0, 0, 0); 

        while (currentTime.getHours() < workingHours.end) {
            const slotStart = formatISO(currentTime);

            if (!occupiedSlots.has(slotStart) && currentTime > new Date()) {
                availableSlots.push({ time: slotStart, isAvailable: true });
            }
            
            currentTime = addMinutes(currentTime, slotDuration);
        }

        return res.status(200).json(availableSlots);

    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar horários disponíveis.' });
    }
};

// Public: create appointment (no auth) - will find or create a guest user
export const createPublicAppointment = async (req, res) => {
    const { date, serviceId, name, phone, email } = req.body;

    if (!date || !serviceId || !name || !phone) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const appointmentDate = new Date(date);

    try {
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return res.status(404).json({ error: 'Serviço não encontrado.' });

        // try to use Prisma flow
        let user = null;
        if (email) user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const existing = await prisma.user.findFirst({ where: { phone } }).catch(() => null);
            if (existing) user = existing;
        }
        if (!user) {
            user = await prisma.user.create({ data: { name, email: email || `${phone}@guest.local`, password: 'guest', role: 'CLIENT' } });
        }

        const start = appointmentDate;
        const end = addMinutes(start, service.duration);

        const conflict = await prisma.appointment.findFirst({
            where: {
                AND: [
                    { date: { gte: start } },
                    { date: { lt: end } },
                ],
            },
        });
        if (conflict) return res.status(409).json({ error: 'Conflito de horário.' });

        const appt = await prisma.appointment.create({
            data: {
                date: start,
                serviceId,
                userId: user.id,
                status: 'CONFIRMED',
            },
            include: { service: { select: { name: true, duration: true } }, user: { select: { name: true, phone: true, email: true } } },
        });
        return res.status(201).json(appt);
    } catch (error) {
        console.warn('Prisma flow failed, falling back to file store:', error?.message || error);
        // fallback to simple file-based storage
        try {
            const arr = await readFileBookings();
            // basic overlap check
            const existingOverlap = arr.find((b) => {
                const bStart = new Date(b.date);
                const bEnd = addMinutes(bStart, b.duration);
                return appointmentDate < bEnd && addMinutes(appointmentDate, 0) < bEnd && appointmentDate >= bStart && appointmentDate < bEnd;
            });
            if (existingOverlap) return res.status(409).json({ error: 'Conflito de horário.' });

            const newItem = { id: Date.now().toString(), date: appointmentDate.toISOString(), serviceId, name, phone, email, duration: 30 };
            arr.push(newItem);
            await writeFileBookings(arr);
            return res.status(201).json(newItem);
        } catch (e) {
            console.error('Fallback file store failed:', e);
            return res.status(500).json({ error: 'Erro interno ao criar agendamento.' });
        }
    }
};

// Public: list upcoming appointments (simplified)
export const getPublicAppointments = async (req, res) => {
    try {
        const now = new Date();
        const appts = await prisma.appointment.findMany({
            where: { date: { gte: now }, status: 'CONFIRMED' },
            include: { service: { select: { duration: true } } },
            orderBy: { date: 'asc' },
        });
        const results = appts.map((a) => ({ date: a.date, duration: a.service.duration }));
        return res.status(200).json(results);
    } catch (error) {
        console.warn('Prisma fetch failed, using file fallback:', error?.message || error);
        try {
            const arr = await readFileBookings();
            const future = arr.filter((a) => new Date(a.date) >= new Date()).map((a) => ({ date: a.date, duration: a.duration }));
            return res.status(200).json(future);
        } catch (e) {
            console.error('Fallback read failed:', e);
            return res.status(500).json({ error: 'Erro interno.' });
        }
    }
};

