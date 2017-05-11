var router = require('express').Router();
var bcrypt = require('bcrypt');

var User = require('../../models/user');
var Room = require('../../models/room');


router.post('/login', (req, res, next) => {
    User.find({ username: req.body.username})
        .then(data => {
            if(data.length) {
                data = data[0];
                comparePassword(req.body.password, data.password, function (err, isMatch) {
                    if (isMatch) {
                        req.session.user = {
                            id: data._id,
                            username: data.username,
                            public_key: data.public_key
                        };
                        res.send({success: true, text: "Redirecting to chat page"})
                    } else {
                        res.send({success: false, text: "Wrong password"})
                    }
                });
            }else {
                res.send({success: false, text: "User not found"})
            }
        })
        .catch(err => {
            console.log('===ERROR AUTHORIZATION===');
            console.log(err);
            res.send({success: false, text: "Failed authorization"});
        });
});

router.post('/logout', (req, res, next) => {
    //kill session
});

router.post('/registration', (req, res, next) => {
    cryptPassword(req.body.password, function(err, hash){
        req.body.password = hash;
        var user = new User(req.body);
        user.save()
            .then(data => {
                req.session.user = {
                    id: data._id,
                    username: data.username,
                    public_key: data.public_key
                };
                res.send({success: true, text: "User successfully created"});
            })
            .catch(err => {
                console.log('===ERROR REGISTRATION===');
                console.log(err);

                switch (err.code){
                    case 11000:
                        res.send({success: false, text: "A user with such an email or name already exists"});
                        break;
                    default:
                        res.send({success: false, text: "Could not create user"});
                }
            });
    });
});

router.post('/credentials', (req, res, next) => {
    res.send({
        success: true,
        data: req.session.user
    })
});
router.post('/credentialsRoom', (req, res, next) => {
    Room.find({name: req.body.room_name})
        .then(data => {
            var profile = {
                room: data[0],
                user: req.session.user
            };
            res.send({success: true, data: profile})
        })
        .catch(err => {
            console.log('===ERROR CREDENTIALSROOM===');
            console.log(err);
            res.send({success: false, text: "Can't found room"})
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