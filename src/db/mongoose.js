const mongoose = require('mongoose');

// Initial connect
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
    } catch (error) {
        console.log(`Error on initial connection: ${error.message}`)
    }
}
connectToDatabase()

mongoose.connection.on('connected', () => {
    console.log('Connected to Database')
})

mongoose.connection.on('disconnected', () => {
    console.log('Sorry, Disconnected to Database')
})

// If error after initial connection
mongoose.connection.on('error', err => {
    console.log(err.message)
})