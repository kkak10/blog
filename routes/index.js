var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log(req.db)
    var db =req.db;
    db.find(function(err,data){
        if(!err){
            res.render('index',{"data":data});
        }
    });

});

module.exports = router;
