var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render("write",{"login":req.session.login})
});

module.exports = router;