const jwt = require('jsonwebtoken');
const User = require('../models/User');

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }
    const tokenJWT = tokenParts[1];

    jwt.verify(tokenJWT, 'secreto', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        
        try {
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            if (user.role !== 'admin') {
                return res.status(403).json({ error: 'Acesso não autorizado' });
            }
            
            req.userId = decoded.id;
            next();
        } catch (error) {
            console.error('Erro ao verificar permissões:', error);
            res.status(500).json({ error: 'Erro ao verificar permissões' });
        }
    });
}

module.exports = verificarToken;
