var router = require('express').Router();

/* load home page */
router.get('/', function(req, res, next) {
    if(req.session.user){
        res.redirect('chat')
    } else {
        res.render('index');
    }
});

/* load room page */
router.get('/chat/:name', function(req, res, next) {
    console.log(req.params.name);
    if(req.session.user) {
        res.render('room', {room_name: req.params.name});
    }else {
        res.redirect('/');
    }
});

/* load chat page */
router.get('/chat', function(req, res, next) {
    if(req.session.user) {
        res.render('chat');
    }else {
        res.redirect('/');
    }
});

module.exports = router;