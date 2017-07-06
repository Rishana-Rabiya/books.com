var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var exUserRouter = express.Router();
var operations = require('../controller/exUserController');
var verify = require('../routes/verify');


/*exUserRouter.route('/create')
.post(verify.verifyUser,function (req, res, next) {
  operations.createUser(req.body,function(result){
    if(result=="exist"){
        res.json({message:"exist"});

    }
    else if(result=="invalid"){
        res.json({message:"invalid"});
    }
    else{
        res.json({message:"success"});
    }
  });
});*/

module.exports = exUserRouter;
