const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).catch((error) => console.log('Connection error! ' + error.message))