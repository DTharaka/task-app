const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
app.use(express.json())  // For get data which we pass

//********************MIDDLEWARE********************//
// without middleware: new request -> run route handle
//
//with middleware: new request -> do something -> run route handle
//

// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     next()
// }) 

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






// Connection to server
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('Listening to the server port: '+ port)
})