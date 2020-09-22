var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

const mongoose = require('mongoose');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. for admin only */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        });
});

// here we will be using the token that we have implemented in the authentication.js file
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

    var token = authenticate.getToken({ _id: req.user._id });
    // we are able to use req.user here coz this callback function gets called after passport.authenticate gets executed
    // and its the work of passport authenticate to adds user info to req.user
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
    // here in the res.json we will send back the token to the user in the form of string here
});

/* incomplete */
router.post('/addStudentDetails', cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'Updation Successful!' });
});


router.get('/logout', cors.cors, (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/'); // this will redirect the user to the homepage
    }
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;  // forbidden operation
        next(err);
    }
});

// for demo only.................
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
    // User.register is a passport local mongoose function to create a user and this takes 3 parameters
    // username password and a function
    User.register(new User({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            }
            else {
                // adding firstname and lastname as well
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                if (req.body.role) {
                    user.role = req.body.role;
                }
                if (req.body.phone) {
                    user.phone = req.body.phone;
                }
                if (req.body.semester) {
                    user.semester = req.body.semester;
                }
                user.save((err, user) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ err: err });
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, status: 'Registration Successful!' });
                    });
                });

            }
        });
});



module.exports = router;
