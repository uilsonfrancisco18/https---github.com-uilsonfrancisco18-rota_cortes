
// src/controllers/ServiceController.js
import { prisma } from '../server.js';
import { authorizeRoles } from '../middlewares/RoleMiddleware.js'; // Importação que adicionamos

// 1. Criar um novo serviço (Protegido por Role)
export const createService = async (req, res) => {
  const { name, price, duration } = req.body;

  if (!name || !price || !duration) {
    return res.status(400).json({ error: 'Todos os campos (nome, preço, duração) são obrigatórios.' });
  }

  try {
    const service = await prisma.service.create({
      data: { name, price: parseFloat(price), duration: parseInt(duration) },
    });
    return res.status(201).json(service);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return res.status(500).json({ error: 'Erro interno ao criar o serviço.' });
  }
};

// 2. Listar todos os serviços
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
    return res.status(200).json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar os serviços.' });
  }
};

// 3. Buscar serviço por ID
export const getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }

    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar o serviço.' });
  }
};

// 4. Atualizar serviço (Protegido por Role)
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, price, duration } = req.body;

  try {
    const updatedService = await prisma.service.update({
      where: { id },
      data: { name, price: price ? parseFloat(price) : undefined, duration: duration ? parseInt(duration) : undefined },
    });
    return res.status(200).json(updatedService);
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Serviço para atualização não encontrado.' });
    }
    console.error('Erro ao atualizar serviço:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar o serviço.' });
  }
};

// 5. Deletar serviço (Protegido por Role)
export const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.service.delete({
      where: { id },
    });
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Serviço para exclusão não encontrado.' });
    }
    console.error('Erro ao deletar serviço:', error);
    return res.status(500).json({ error: 'Erro interno ao deletar o serviço.' });
  }
};

