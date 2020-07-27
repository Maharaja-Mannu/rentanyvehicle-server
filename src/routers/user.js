const path = require('path')
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()



router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.send({user, token})
        
    } catch (error) {
       res.status(400).send(error.message)
        
    }
})


router.post('/signin', async (req, res) => {
    
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// logout
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Successfully logged out.')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//logout all
router.post('/user/logoutAll', auth, async (req, res) => {
   try {
       req.user.tokens = []
       await req.user.save()
       res.send()
   } catch (error) {
       res.status(500).send()
   }
})

// fetch user profile
router.get('/me', auth, async (req, res) => {
    
    res.send({
        name: req.user.name
    })
    
})

// update user profile
router.patch('/user/update', auth, async (req, res) => {

    const updates = Object.keys(req.body) // taking updates value
    const allowedUpdates = ['name', 'phone', 'password'] // fields are allowed to update
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // making sure updating value should be allowed fields
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// delete user profile
router.delete('/user/me', auth, async (req, res) => {
   try {
       await req.user.delete()
       res.send(req.user)

   } catch (error) {
       res.status(500).send()
   }
})


module.exports = router