const Sequelize = require('sequelize');
const conn = require('../conn');

const User = conn.define('user', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, { 
  getterMethods: {
    fullname(value) {
      return `${this.firstname} ${this.lastname}`
    }
  }
});


module.exports = User;

