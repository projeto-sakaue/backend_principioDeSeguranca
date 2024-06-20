const Sequelize = require('sequelize');


const sequelize = new Sequelize('backend_jwt', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
