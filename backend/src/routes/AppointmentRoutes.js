
import express from 'express';
import { 
    createAppointment, 
    getUserAppointments,
    getAvailableSlots,
} from '../controllers/AppointmentController.js';
import { protect } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Rotas de Agendamento (Protegidas)
router.post('/', protect, createAppointment); 
router.get('/me', protect, getUserAppointments); 

// Rotas públicas (para o frontend buscar antes de agendar)
router.get('/slots', getAvailableSlots); 

export default router;

