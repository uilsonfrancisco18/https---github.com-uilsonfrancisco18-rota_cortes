
// src/middlewares/RoleMiddleware.js
// Checa se o usuário tem uma das roles permitidas
export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        // req.userRole foi definido pelo AuthMiddleware
        const userRole = req.userRole; 

        if (!userRole) {
            return res.status(403).json({ error: 'Acesso negado: Função de usuário não definida.' });
        }
        
        // Verifica se a role do usuário está na lista de allowedRoles
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Acesso negado: Você não tem permissão para acessar esta rota.' });
        }

        next();
    };
};

