const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
app.use(express.json())  // For get data which we pass

app.use(userRouter)
app.use(taskRouter)

//**********HASHING PASSWORD BY BCRYPTJS**********//
// const bcrypt = require('bcryptjs')

// const myFunction = async ()=>{
//     const password = 'dhmm@23#'
//     const hashedPassword = await bcrypt.hash(password,8)

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('dhmm@23#',hashedPassword)
//     console.log(isMatch)
// }
// myFunction()

//**********AUTHENTICATE WITH JWT**********//
// header-> meta data, body-> data that we provided, signature->verify the token
// const jwt = require('jsonwebtoken')

// const myFunction = async() =>{
//     const token =  jwt.sign({_id: 'abc123'},'thisismynodepractical', {expiresIn: '2 days'})
//     console.log(token)

//     const data =  jwt.verify(token,'thisismynodepractical')
//     console.log(data)
// }

// myFunction()

// Working with multer package
// const multer = require('multer');
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
        // cb(new Error('File must be in PDF format'))
        // cb(undefined,true)
        // cb(undefined,false)
        // if (!file.originalname.endsWith('.pdf')) {
        //     return cb(new Error('Please upload a PDF'))
        // }
        // cb(undefined,true)
        // if(!file.originalname.match(/\.(doc|docx)$/)){
        //     return cb(new Error('Please upload a Word Document'))
        // }
        // cb(undefined,true)
//     }
// })

// const errorMiddleware = (req,res,next)=>{
//     throw new Error('From my middleware');
// }

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error: error.message})
// })


// Connection to server
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('Listening to the server port: '+ port)
})