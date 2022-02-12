const { Sequelize } = require('sequelize');
// Passing parameters separately (other dialects)
module.exports = new Sequelize('codegig', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
