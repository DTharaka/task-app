const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req,res)=>{
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/tasks', auth, async (req,res)=>{
    try {
        const tasks = await Task.find({author: req.user._id})
        res.send(tasks)  // OR
        // await req.user.populate('tasks').execPopulate()
        // res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth,  async (req,res)=>{
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id: _id , author: req.user._id}) // fetch task using task id and it's authors id
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id',auth, async(req,res)=>{
    const _id = req.params.id
    try {
        // const task = await Task.findByIdAndDelete(_id)
        const task = await Task.findOneAndDelete({_id: _id , author: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// USING PROMISES
router.patch('/tasks/:id', auth, async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','complete']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates !'})
    }
    try {
        const _id = req.params.id
        // const task = await Task.findByIdAndUpdate(_id)
        const task = await Task.findOne({_id: _id , author: req.user._id})
        // updates.forEach((update)=>{
        //     task[update] = req.body[update]
        // })
        // await task.save()
        
        // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update)=>{
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)

    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router