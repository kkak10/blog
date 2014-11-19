var express = require('express');
var router = express.Router();

/* GET users listing. */
/*
router.get('/', function(req, res) {
    var db = req.db;
    console.log("hi")
    var a = db.find({$and:[
        {$or : [{type:"html"},{type:"css"},{type:"javascript"}]}
    ]},function(err,data){
        if(!err){
            res.render('front',{"data":data})
        }
    });
});
*/

router.get('/', function(req, res) {
    var db = req.db;

    var a = db.find({$and:[
        {$or : [{type:"html"},{type:"css"},{type:"javascript"}]}
    ]}).sort({"reg_date":-1}).find(function(err,data){
        res.render('front',{"data":data})
    })
});
module.exports = router;