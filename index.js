require('dotenv').config({path:'./config.env'})
const express = require('express');
const db = require('./db');
const app = express();
const stdroutes = require('./Routes/SchoolRoutes');

app.use(express.json())
app.use('/api',stdroutes);
const PORT = process.env.PORT || 8016;
app.listen(PORT,()=>console.log('server running at port:',PORT));
