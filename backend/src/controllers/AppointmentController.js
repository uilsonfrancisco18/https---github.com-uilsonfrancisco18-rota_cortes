
import { prisma } from '../server.js';
import { addMinutes, startOfDay, endOfDay, formatISO } from 'date-fns';

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

