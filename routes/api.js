var express = require('express');
var router = express.Router();

exports.boardFindAll = function(req,res){
    var db = req.db;
    var json =  db.find(function(err,data){
        if(!err){
            res.send(data);
        }
    });
}

module.exports = router;