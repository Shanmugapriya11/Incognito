// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var questionSchema = mongoose.Schema({
    id       : {type: Number, unique : true},
    question : String,
    upvote   : {type: Number, default: 0},
    created  : {type: Date, default: Date.now}

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Question', questionSchema);
