var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {

    if(req.session.user) {
		res.render('chat', {name: req.session.user.login});
    }else {
		res.redirect('/');
    }

});









module.exports = router;