const path = require('path')
const express = require('express')

require('./db/mongoose')
const vehicleRouter = require('./routers/vehicle')
const userRouter = require('./routers/user')
const app = express()
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())
app.use(vehicleRouter)
app.use(userRouter)
// error-handling middleware function
app.use((err, req, res, next) => {
    res.status(500).send(err.message)
})

module.exports = app