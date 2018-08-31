const Sequelize = require('sequelize');
const UserModel = require('./models/user');

const sequelize = new Sequelize('mysql', 'root', 'groot', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max1: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }

});

sequelize.authenticate()
  .then(() => {
    console.log('Connection established successfully')
  })
  .catch(err => {
    console.error('DB connection failed', err);
  });

const User = UserModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    console.log('database and tables created successfully');
  });


module.exports = { sequelize, User };
