var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// we have removed username and password field from here coz passport local mongoose will take care of that
// here username is same as email and role can be student and faculty and semester can be 1 - 6
var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'student'
    },
    admin: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        default: ''
    },
    semester: {
        type: String,
        default: ''
    }
});

User.plugin(passportLocalMongoose);
// this will store the username and the hashed password here
// and by this we can use many functions that we can use later in the user authentication

module.exports = mongoose.model('User', User);       