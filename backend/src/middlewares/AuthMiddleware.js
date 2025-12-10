
// src/middlewares/AuthMiddleware.js
import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await prisma.user.findUnique({ 
        where: { id: decoded.userId },
        select: { id: true, role: true } 
      });
      
      if (!req.user) {
        return res.status(401).json({ error: 'Não autorizado, usuário não encontrado.' });
      }

      req.userId = req.user.id;
      req.userRole = req.user.role;
      
      next();
    } catch (error) {
      console.error('Erro de Autenticação:', error);
      return res.status(401).json({ error: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado, token não encontrado.' });
  }
};

