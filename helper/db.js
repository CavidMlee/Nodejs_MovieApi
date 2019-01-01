const mongoose = require('mongoose');

module.exports = ()=>{

    mongoose.connect('mongodb://Cavid:watwatwat1995@ds123372.mlab.com:23372/movie_api',{ useNewUrlParser: true });

    mongoose.connection.on('open', ()=>{
        console.log("MongoDb connected")
    });

    mongoose.connection.on('error', (err)=>{
        console.log("MongoDb Error " + err)
    });

    mongoose.Promise = global.Promise;
};