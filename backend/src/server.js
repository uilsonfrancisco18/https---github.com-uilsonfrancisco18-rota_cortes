import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import ServiceRoutes from './routes/ServiceRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import AppointmentRoutes from './routes/AppointmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES GERAIS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Inicializa o Prisma Client (SQLite)
// -----------------------------------------------------------
export const prisma = new PrismaClient();
// -----------------------------------------------------------


// Rota de teste
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend da Barbearia OK!', db_status: 'Connected' });
});

// AQUI IREMOS ADICIONar AS ROTAS
app.use('/api/services', ServiceRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/appointments', AppointmentRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});