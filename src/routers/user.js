const express = require('express')
const mongoose = require('mongoose');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
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

// const upload = multer({
//     dest: 'avatars' 
// })

// router.post('/users/me/avatar', upload.single('avatar'),(req,res)=>{
//     res.send()
// })

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload jpg, jpeg, png formats only'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    // req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({
        Error: error.message
    })
})

router.delete('/users/me/avatar',auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
        
    } catch (error) {
        res.status(404).send()
    }
})


module.exports = router