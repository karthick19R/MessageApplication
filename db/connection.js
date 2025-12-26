require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,process.env.DB_PASS,
    {
        host:process.env.HOST,
        dialect:process.env.DB_DIALECT
    }
);
try{
    sequelize.authenticate()
    console.log("Connection is Successful")
}catch(err){
    console.log("Connection to database failed")
}

module.exports = sequelize;