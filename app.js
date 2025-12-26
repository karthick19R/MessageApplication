const express = require('express');
const sequelize = require('./db/connection')
const app = express();
const userrouter = require('./routers/userrouter')
const messagerouter = require('./routers/messagerouter')
app.use(express.json());
app.use('/user',userrouter)
app.use('/message',messagerouter)

//app.use('/message/',messagerouter)
// app.get('/' ,(req,res) =>{
//     res.send("Its working")
// })
sequelize.sync({ alter: true }) // adjusts table to match model
  .then(() => console.log("Database synced"))
  .catch(err => console.log("Error syncing database", err));

app.listen(3000,(err)=>{
    if(err){
    console.log("Error in main function",err)}
    else{
        console.log("Server starts to listen port 3000")
    }
})