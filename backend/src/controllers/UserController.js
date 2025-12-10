
// src/controllers/UserController.js
import { prisma } from '../server.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const HASH_SALT = 10; 

// 1. Registro de Novo Usuário (Cliente/Barbeiro)
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }
  
  const userRole = (role && (role.toUpperCase() === 'BARBER' || role.toUpperCase() === 'ADMIN')) ? role.toUpperCase() : 'CLIENT';

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário já existe com este email.' });
    }

    const hashedPassword = await bcrypt.hash(password, HASH_SALT);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(201).json({ message: 'Usuário registrado com sucesso.', user: newUser });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
};


// 2. Login de Usuário
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'SEGREDO_PADRAO_MUITO_INSEGURO', 
      { expiresIn: '1d' }
    );

    return res.status(200).json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};


