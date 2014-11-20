var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.contentType('text/html');

    var db =req.db;
    db.find(function(err,data){

    }).sort({"reg_date":-1}).find(function(err,data){
        res.render("index",{data:data,"login":req.session.login});
    })
});

module.exports = router;
