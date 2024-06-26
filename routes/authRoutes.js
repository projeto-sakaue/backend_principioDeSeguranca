const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logger = require('../logger');

const router = express.Router();


router.post('/register', async (req, res) => {
    logger.info('Rota de registro (/register) foi acessada')
    const { username, password, role } = req.body;
    try {
        // Hash da senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
        logger.info('Erro ao registrar usuario na rota (/register)')
    }
});


router.post('/login', async (req, res) => {
    logger.info('Rota de login (/login) foi acessada')
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            logger.info('Usuário não encontrado ao logar')
            return res.status(404).json({ error: 'Usuário não encontrado' });
            
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.info('Credenciais inválidas')
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secreto', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

module.exports = router;
