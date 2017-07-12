var express = require('express');
var router = express.Router();
var normRouter = express.Router();
var operations = require('../controller/normUserController');
var verify = require('../routes/verify');
var orderOperations = require('../controller/orderController');

normRouter.route('/:id')
.get(verify.verifyUser,function (req, res, next) {
    if(req.params.id=="enable"){
        operations.findPendingUsers(function(result){
          if(result){
            res.json({user:result});
          }
          else {
              res.json({success:false})
          }
        });

    }
    else if(req.params.id=="disable"){
        operations.findUsers(function(result){
          if(result){
            res.json({user:result});
          }
          else {
              res.json({success:false})
          }
        });
    }

});



normRouter.route('/action')
.put(verify.verifyUser,function (req, res, next) {
    console.log(req.body);
    if(req.body.flag=="enable"){
        operations.enableUser(req.body.id,function(result){
          if(result){
            res.json({success:true});
          }
          else {
              res.json({success:false})
          }
        });

    }
    else if(req.body.flag=="disable"){
        operations.disableUser(req.body.id,function(result){
          if(result){
            res.json({success:false});
          }
          else {
              res.json({success:false})
          }
        });
    }

});

normRouter.route('/order/:id')
.get(function(req,res,next){
    orderOperations.findStatusUser(req.params.id,function(result){
        if(result){
            res.json({order:result});
        }
        else {
            res.json({success:false})
        }

    });
});

normRouter.route('/book/:id')
.get(function(req,res,next){
    orderOperations.findOrderWithEmail(req.params.id,function(result){
        if(result){
            res.json({order:result});
        }
        else {
            res.json({success:false})
        }

    });
});



module.exports = normRouter;
