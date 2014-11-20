var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    var db = req.db;

    var a = db.find({$and:[
        {$or : [{type:"PHP"},{type:"Spring"},{type:"Linux"},{type:"Node.js"}]}
    ]}).sort({"reg_date":-1}).find(function(err,data){
        res.render('back',{"data":data,"login":req.session.login})
    })
});

module.exports = router;