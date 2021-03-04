const express = require('express')
const multer = require('multer')
// const sharp = require('sharp')
const Vehicle = require('../models/vehicle')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/search/:category/:origin/:dest', async (req, res) => {
    let query
    // for(param in req.params) {
    //     console.log(req.params[param])
    // }
    query = {$and: [{category: req.params.category}, {origin: req.params.origin}]}
    try {
        const data = await Vehicle.find(query, 'category brand origin images')
        res.send({ data })
    } catch (error) {
        res.status(400).send("Invalid request!")
    }
})


router.get('/mine', auth, async (req, res) => {
    try {
        const data = await Vehicle.find({ owner: req.user._id }, 'category brand model reg_number origin images')
        res.send({ data })
    } catch (error) {
        res.status(400).send("Invalid request!")
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
router.post('/new', auth, upload.single('images'), async (req, res, next) => {
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
        res.status(400).send(error.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const data = await Vehicle.findOne({ _id: req.params.id })
        res.status(200).send({ data })
    } catch (error) {
        res.status(400).send('Invalid Request!')
    }
})
// update ad
router.patch('/:id', auth, async (req, res) => {
    delete req.body._id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['brand', 'category', 'images', 'model', 'origin', 'reg_number']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send('Invalid update')
    }
    try {
        const data = await Vehicle.findOne({
            _id: req.params.id, owner: req.user._id
        })
        updates.forEach(update => data[update] = req.body[update])
        await data.save()
        res.send({ data })
    } catch (error) {
        res.status(400).send('Invalid Request!')
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const data = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        res.send({ data })
    } catch (error) {
        res.status(400).send("Invalid request!")
    }
})

module.exports = router