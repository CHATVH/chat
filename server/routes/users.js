var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var User = require('../models/DB');

router.post('/', function(req, res, next) {
    cryptPassword(req.body.password, function(err, hash){
        req.body.password = hash;
        var user = new User(req.body);
        user.save()
            .then(data => {
                res.send({status: 200});
            })
            .catch(err => {
                res.send({status: 500, text: "Can't connect to db"})
            });

    });
});

router.post('/login', function(req, res, next) {
     User.find({ login: req.body.login})
         .then(data => {
             comparePassword(req.body.password, data[0].password, function(err, isMatch){
                 if(isMatch) {
                     res.send({success: true, text: "User not found"});
                 }else {
                     res.send({success: false, text: "User not found"});
                 }
             });
         });
});

function cryptPassword(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });

    });
}

function comparePassword(password, userPassword, callback) {
    bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
        if (err)
            return callback(err);
        return callback(null, isPasswordMatch);
    });
}


module.exports = router;