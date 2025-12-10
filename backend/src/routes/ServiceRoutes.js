
// src/routes/ServiceRoutes.js
import express from 'express';
import { protect } from '../middlewares/AuthMiddleware.js';
import { authorizeRoles } from '../middlewares/RoleMiddleware.js';
import { 
    createService, 
    getAllServices, 
    getServiceById, 
    updateService, 
    deleteService 
} from '../controllers/ServiceController.js';

const router = express.Router();

// Rotas de CRUD de Serviços (/api/services)
// Rotas de consulta são públicas
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Rotas de modificação (POST, PUT, DELETE) são protegidas
router.post('/', protect, authorizeRoles(['BARBER', 'ADMIN']), createService);
router.put('/:id', protect, authorizeRoles(['BARBER', 'ADMIN']), updateService);
router.delete('/:id', protect, authorizeRoles(['BARBER', 'ADMIN']), deleteService);

export default router;

