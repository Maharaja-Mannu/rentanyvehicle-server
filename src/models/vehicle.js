const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,

    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    reg_number: {
        type: String,
        unique: true,
        required: true,
        maxlength: 13,
        uppercase: true,
        trim: true
    },
    origin: {
        type: String,
        required: true,
    },
    images: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})
const Vehicle = mongoose.model('Vehicle', vehicleSchema)
module.exports = Vehicle