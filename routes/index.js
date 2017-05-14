var router = require('express').Router();

router.use('/api', require('./api/index'));
router.use('/', require('./pages/index'));

module.exports = router;