var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {
    console.log(req.session);
    if(req.session.user) {
        console.log(req.session.user.login);
		res.render('chat', {name: req.session.user.login});
    }else {
		res.redirect('/');
    }

});

module.exports = router;