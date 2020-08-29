const express = require('express')
const multer = require('multer')
// const sharp = require('sharp')
const Vehicle = require('../models/vehicle')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/vehicle/:category/:origin/:dest', async (req, res) => {
    let query
    // for(param in req.params) {
    //     console.log(req.params[param])
    // }
    query = {$and: [{category: req.params.category}, {origin: req.params.origin}]}
    try {
        const data = await Vehicle.find(query)
        if (!data) return res.status(400).send("Invalid request!")
        res.send({ data })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/vehicle/:id', async (req, res) => {
    try {
        const data = await Vehicle.findOne({ _id: req.params.id })
        if (!data) {
            return res.status(400).send("Invalid request!")
        }
        res.status(200).send({ data })
    } catch (error) {
        res.status(400).send("Bad Request")
    }
})

router.post('/user/ads', auth, async (req, res) => {
    try {
        const data = await Vehicle.find({ owner: req.user._id })
        if (!data) {
            return res.status(400).send("Invalid request!")
        }
        res.send({ data })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

const upload = multer({
    dest: 'public/avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
            return cb(new Error('File type must be jpg, jpeg or png'))
        }
        cb(undefined, true)
    }
})
router.post('/submitad', auth, upload.single('images'), async (req, res, next) => {
    // if we want to store buffer in database
    //const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const vehicle = new Vehicle({
        ...req.body,
        images: req.file.filename,
        owner: req.user._id
    })
    try {
        await vehicle.save()
        res.status(201).send(vehicle)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// update ad
router.patch('/vehicle/:id', auth, async (req, res) => {
    delete req.body._id
    delete req.body.__v
    delete req.body.createdAt
    delete req.body.updatedAt
    const updates = Object.keys(req.body)
    const allowedUpdates = ['brand', 'category', 'images', 'model', 'origin', 'reg_number', 'owner']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send('Invalid update')
    }
    try {
        const data = await Vehicle.findOne({
            _id: req.params.id, owner: req.user._id
        })
        if (!data) {
            return res.status(400).send("Invalid request!")
        }
        updates.forEach(update => data[update] = req.body[update])
        await data.save()
        res.send({ data })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/vehicle/:id', auth, async (req, res) => {

    try {
        const data = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!data) {
            return res.status(400).send("Invalid request!")
        }
        res.send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router