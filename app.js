var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var front = require('./routes/front');
var back = require('./routes/back');
var include = require('./routes/include');
var api = require('./routes/api');
var post = require('./routes/post');
var write = require('./routes/write');
var app = express();
var session = require('express-session')
var moment = require('moment');
var fs = require('fs');
var multer = require("multer");

//moment().format(YYYY-MMMM-h:mm:ss);
var mongoose = require('mongoose');
mongoose.connect('mongodb://hanur.me/blog');
var Schema = mongoose.Schema;
var boardSchema = new Schema({
    'type':String,
    'title': String,
    'content':String,
    'reg_date':Date
});
var boardModel = mongoose.model('board', boardSchema);

app.use(function(req,res,next){
    req.db = boardModel;
    next();
});

/*
boardModel.find(function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
})

console.log(boardModelObject)
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'keyboard cat'
}))

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(multer({
    dest: './uploads/',
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    }
}))

app.use('/', routes);
app.use('/FRONT', front);
app.use('/BACK', back);
app.use('/include', include);
app.use('/api/board', function(req,res){
    var db = req.db;
    var json =  db.find(function(err,data){
        if(!err){
            res.send(data);
        }
    });
});

app.get('/login/:id/:pw',function(req,res){
    var id = req.params.id || "";
    var passwd = req.params.pw || "";

    if(id === "kkak10" && passwd === "hanurme"){
       req.session.login = true;
        res.send("<script>window.location.replace('/')</script>")
       //res.redirect("/");
    }else{
        res.send("아이디와 비밀번호를 확인해 주세요.<br />3초후 메인 페이지로 이동합니다. <script>setTimeout(function(){window.location.replace('/');},3000)</script>")
    }
});

app.get("/logout",function(req,res){
   req.session.destroy();
   res.send("<h1>로그아웃 되셨습니다.</h1>3초후 이동합니다.<script>setTimeout(function(){window.location.replace('/')})</script>")
});

app.get('/post/:id',function(req,res){
    var db = req.db;
    var id = req.params.id;
    var json =  db.find({_id:id},function(err,data){
        if(!err){
            res.render("post",{"data":data,"login":req.session.login});
        }
    });
});

app.get('/write',function(req,res){
    if(req.session.login){
        res.render("write",{"login":req.session.login});
    }else{
        res.render("write",{"login":req.session.login});
    }

});

app.post('/write',function(req,res){
    var boardModelObject = new boardModel();

    boardModelObject.type = req.param("type");
    boardModelObject.title = req.param("title");
    boardModelObject.content = req.param("content");
    boardModelObject.reg_date = new Date();
    boardModelObject.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect('/');
        }
    });

/*
    req.db.find(function(err,data){

    }).sort({"reg_date":-1}).find(function(err,data){
        res.render("index",{data:data});
    })
*/
});

app.post("/write/img",function(req,res){
    res.send("/" + req.files.file.name)
})

app.get("/update/:id",function(req,res){
    var db = req.db;
    var id = req.params.id;
    db.find({"_id":id},function(err,data){
        res.render("update",{data:data,login:req.session.login});
    })
});

app.post("/update/:id",function(req,res){
    var db = req.db;
    var boardModelObject = new boardModel();
    var id = req.params.id;
    console.log(id)
    boardModelObject.type = req.param("type");
    boardModelObject.title = req.param("title");
    boardModelObject.content = req.param("content");
    boardModelObject.reg_date = new Date();

    boardModelObject.update(
        {_id : id},
        {
            $set:{
                title : boardModelObject.title,
                content : boardModelObject.content,
                reg_date : new Date()
            }
        },function(err,a){
            console.log(err)
            console.log(a)
        }
    );
    //res.redirect("/")
});

app.get("/delete/:id",function(req,res){
    var db = req.db;
    var id = req.params.id;
    db.remove({"_id":id},function(err,data){
        res.redirect("/")
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
