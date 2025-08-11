const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test-family-tree', 'postgres', 'Test@123', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
