const express = require('express');
const app = express();
const cors = require('cors');
const loginRouter = require('./routes/login')
require('dotenv').config()

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/api/login', loginRouter);

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})