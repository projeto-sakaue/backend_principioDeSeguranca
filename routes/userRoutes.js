const express = require('express');
const verificarToken = require('../middlewares/authMiddleware');
const User = require('../models/User'); 

const router = express.Router();

router.get('/users', verificarToken, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'role'] 
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

module.exports = router;
