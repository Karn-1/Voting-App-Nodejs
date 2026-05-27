const express = require("express")
const app = express();
const bodyparser = require('body-parser')

const db = require('./db')

app.use(bodyparser.json());

const userRoute = require('./routes/userRoutes')
app.use('/user',userRoute);

const candidateRoute = require('./routes/candidateRoute')
app.use('/candidate',candidateRoute);

const port = 3000;



app.listen(port,()=>{
  console.log ("Server started successfully")
})