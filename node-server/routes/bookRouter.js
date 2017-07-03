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
    });
});


bookRouter.route('/')
.get(verify.verifyUser,function(req,res,next){
    operations.findBook(function(result){
        if(result){
            res.json({book:result});
        }
    });
});


bookRouter.route('/find')
.post(function(req,res,next){
    var result = req.body;
    console.log(result);
    operations.bookFindFilter(result,function(result){
        if(result){
            res.json({books:result});
        }
    });
});

bookRouter.route('/find/:id')
.get(function(req,res,next){
    var id = req.params.id;
    operations.findAbook(id,function(result){
        if(result){
            operations.findAuthor(result.author,function(response){
                if(response){
                    res.json({book:result,author:response});
                }
            });
        }
    });
});






















module.exports = bookRouter;
