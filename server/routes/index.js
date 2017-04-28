var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.user){
	  return res.redirect('chat', {name: req.session.user.login})
  } else {
	  res.render('index');
  }
});

module.exports = router;
