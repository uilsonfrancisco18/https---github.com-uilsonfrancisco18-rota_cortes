
import express from 'express';
import { 
    createAppointment,
    getUserAppointments,
    getAvailableSlots,
    createPublicAppointment,
    getPublicAppointments,
    cancelAppointment,
} from '../controllers/AppointmentController.js';
import { protect } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Rotas de Agendamento (Protegidas)
router.post('/', protect, createAppointment); 
router.get('/me', protect, getUserAppointments); 
router.delete('/:appointmentId', protect, cancelAppointment);

// Rotas públicas (para o frontend buscar antes de agendar)
router.get('/slots', getAvailableSlots); 

// Rotas públicas para integração simples (sem auth)
router.post('/public', createPublicAppointment);
router.get('/public', getPublicAppointments);

export default router;

