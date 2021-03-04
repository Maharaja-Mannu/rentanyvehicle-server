const path = require('path')
const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const vehicleRouter = require('./routers/vehicle')
const userRouter = require('./routers/user')
const app = express()
app.use(express.static(path.join(__dirname, '../public')))
// app.use(express.static(path.join(__dirname, '../build')))
app.use(express.json())
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", `${process.env.ORIGIN}`);
    res.header("Access-Control-Allow-Methods", "PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/vehicle', vehicleRouter)
app.use(userRouter)
// error-handling middleware function
app.use((err, req, res, next) => {
    res.status(500).send(err.message)
})

module.exports = app