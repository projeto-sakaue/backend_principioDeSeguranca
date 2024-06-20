const express = require('express');
const sequelize = require('./config/sequelize');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const logger = require('./logger');

const app = express();

// Middleware para JSON parsing
app.use(express.json());

// Middleware para usar as rotas de autenticação
app.use('/auth', authRoutes);

// Middleware para usar as rotas de usuários (protegidas por JWT)
app.use('/api', userRoutes);

// Conexão com o banco de dados e inicialização do servidor
sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
}).catch(error => {
    console.error('Erro ao conectar ao banco de dados:', error);
});
