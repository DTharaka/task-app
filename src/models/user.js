// Create a user model
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Text = require('./task')

const userSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if (value<0) {
                throw new Error('Age must be a positive value')
            }
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})

// Hide properties of Mongoose objects in Node.JS JSON responses 
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
// OR
// userSchema.methods.getPublicProfile = function () { // call this function where it want
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }

// methods - Access on instences(Instance methods)
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token: token})
    await user.save()
    return token
}

// statics - Access on the model(Model methodes))
userSchema.statics.findByCredentials = async (email,password)=>{
    
    const user = await User.findOne({email : email})
    if (!user) {
        throw new Error('Email not matched')
    }
    
    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) {
        throw new Error('Password not matched')
    }
    
    return user
}

// Set hashed password before the save users when occuring the password can be change (creating user & updating user)
userSchema.pre('save', async function (next) {
    const user = this
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

// Delete all the tasks when user is removed 
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ author: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User