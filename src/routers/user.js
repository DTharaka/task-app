const express = require('express')
const mongoose = require('mongoose');
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')


// ********** POST(CREATE)=>Sign Up********** //
router.post('/users', async(req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(404).send(error)
    }
})

// Route for Log-in user
router.post('/users/login', async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    } catch (error) {
        res.status(400).send()
    }
})

// Route for Log-out user(remove the given token for specific user)
router.post('/users/logout', auth, async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token 
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route for Log-out all user(remove the given tokens)
router.post('/users/logoutAll', auth, async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// *************** GET(READ)*************** //
router.get('/users/me', auth , async (req,res)=>{
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (error) {
    //     res.status(500).send(error)
    // }
    res.send(req.user)
})
// we can't get user by Id if it's not our own id. so /users/me route stisfy this route
// router.get('/users/:id', async (req,res)=>{
//     const _id = req.params.id
//     try { 
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

// *************** DELETE *************** //
// If when we log we cn delete only our object, want authenticate to do it
// so we use /users/me route instead /users/:id
// so we use req.user._id instead req.params.id
router.delete('/users/me', auth, async(req,res)=>{
    // const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(req.user._id)
        if (!user) {
            return res.status(404).send()
        }

        // await req.user.remove()
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})


// *************** PATCH(UPDATE) *************** //
// USING ASYNC-AWAIT
// We can update an user account when only is authenticated. If it isn't we can't update it 
// so we use /users/me route instead /users/:id
// so we use req.user._id instead req.params.id

// router.patch('/users/:id', async (req,res)=>{
router.patch('/users/me', auth, async (req,res)=>{    
    // When updating with extra property doesn't exist in a model.(user update with height))
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates !'})
    }

    try {
        // const _id = req.params.id
        // const user = await User.findByIdAndUpdate(_id)
        // const user = await User.findByIdAndUpdate(req.user.id)
        // *** we don't need to fetch the user by its id. bcz, we already exist req.user
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        
        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        // if (!user) { // we remove this bcz, we know exactly user already logged in.
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})



module.exports = router