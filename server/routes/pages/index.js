var router = require('express').Router();

/* load home page */
router.get('/', function(req, res, next) {
    if(req.session.user){
        res.redirect('chat')
    } else {
        res.render('index');
    }
});

/* load chat page */
router.get('/chat', function(req, res, next) {
    if(req.session.user) {
        res.render('chat', {name: req.session.user.username});
    }else {
        res.redirect('/');
    }
});

module.exports = router;