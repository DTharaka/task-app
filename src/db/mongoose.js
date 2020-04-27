// Connect to db and require mongoose
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/task-app-db', 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
