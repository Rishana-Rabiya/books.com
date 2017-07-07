var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bookRouter = express.Router();
//var multer = require('multer');
//var upload = multer({ dest: 'uploads/' })
var operations = require('../controller/bookController');
var verify = require('../routes/verify');


bookRouter.route('/upload')
.post(verify.verifyUser,function (req, res, next) {
    operations.createBook(req.body,function(result){
        if(result){
            console.log(result);
            res.json({success:true});
        }
        else{
            res.json({success:false});
        }
    });
});


bookRouter.route('/')
.get(verify.verifyUser,function(req,res,next){
    operations.findBook(function(result){
        if(result){
            res.json({book:result});
        }
        else {
        res.json({success:false});
        }
    });
});


bookRouter.route('/find')
.post(verify.verifyUser,function(req,res,next){
    var result = req.body;
    console.log(result);
    operations.bookFindFilter(result,function(result){
        if(result){
            res.json({books:result});
        }
        else {
            res.json({success:false});
        }
    });
});

bookRouter.route('/find/:id')
.get(verify.verifyUser,function(req,res,next){
    var id = req.params.id;
    operations.findAbook(id,function(result){
        if(result){
            res.json({book:result});
        }
        else {
            res.json({success:false});
        }

    });
});






















module.exports = bookRouter;
