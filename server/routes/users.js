var express = require('express');
var router = express.Router();

var User = require('../models/DB');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    var user = new User(req.body);

    user.save()
        .then(data => {
          console.log(data);
        })
        .catch(err => {
            console.log('err', err);
        });
    res.send('respond with a resource');
});

module.exports = router;

