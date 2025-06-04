const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./connect/database.js')
const cors = require('cors')
const port = process.env.PORT || 5000;
const {errorHandler} =require('./middleware/errorMidleware.js')

connectDB();
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())



app.use('/pc/users' , require('./routes/studentRoutes.js'))
app.use('/pc/builds', require('./routes/buildRoutes'));
app.use('/pc/parts', require('./routes/partRoutes'));
app.use(errorHandler)
app.listen(port, ()=> console.log(`server is listening on ${port}`));

console.log("server is running ")