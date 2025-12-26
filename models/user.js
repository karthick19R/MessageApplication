const {DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const user = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = user;