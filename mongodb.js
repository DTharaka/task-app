// CRUD => Create, Read, Update, Delete

const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient; // Give us access to the functopn necessary to connect it to db.
const ObjectID = mongodb.ObjectID;
// const {MongoClient,ObjectID} = require("mongodb") // Object destructuring 

const connectionURL = 'mongodb://localhost:27017'; // Connection url
const databaseName = 'task-app-db'; // Database Name

//**** Genarate our own IDs*****//
// const id = new ObjectID()
// console.log(id.id.length)
// console.log(id.toHexString().length)

// Connect using MongoClient
MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client)=>{
    if (error) {
        return console.log('Unable to connect to DB!!!')
    }
    const db = client.db(databaseName) // creating db automatically

    //****add collection name(users) and insert data into it****//
    // db.collection('users').insertOne({
    //     name: 'Mark',
    //     age: 26,
    //     country: 'Srilanka'
    // },(error,result)=>{
    //     if (error) {
    //         return console.log('Unable to insert users') // If, there is an error when inserting data
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name: 'Dilruk',
    //         age: 23,
    //         country: 'India'
    //     },
    //     {
    //         name: 'Thisara',
    //         age: 20,
    //         country: 'NZ'
    //     }
    // ],(error,result)=>{
    //     if (error) {
    //         return console.log('Unable to insert users')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Dilruk',
    //         completed: true
    //     },
    //     {
    //         description: 'Alex',
    //         completed: false
    //     },
    //     {
    //         description: 'Jenny',
    //         completed: true
    //     }
    // ],(error,result)=>{
    //     if (error) {
    //         return console.log('Unable to insert tasks')
    //     }
    //     console.log(result.ops)
    // })

    //****Find entered data****//
    // db.collection('users').findOne({ _id: new ObjectID('5e9d99d3ea65ed39787e4d2b')},(error,user)=>{
    //     if (error) {
    //         return console.log('Unable to fetch data')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({age: 20}).toArray((error,user)=>{
    //     console.log(user) // return a cursor
    // })

    //****Update entered data****//
    // db.collection('users')
    //     .updateOne({_id: new ObjectID('5e9d99d3ea65ed39787e4d2b')}
    //     ,{
    //         $set: {
    //             name: 'John'
    //         }
    //     }).then((result)=>{
    //         console.log(result)
    //     }).catch((error)=>{
    //         console.log(error)
    //     })
    //****Delete entered data****//
})
 
