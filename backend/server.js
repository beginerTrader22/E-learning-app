const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./connect/database.js')
const port = process.env.PORT || 5000;
const {errorHandler} =require('./middleware/errorMidleware.js')
const cors = require('cors');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));