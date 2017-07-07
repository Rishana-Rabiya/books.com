var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fineRouter = express.Router();
var operations = require('../controller/fineController');
var verify = require('../routes/verify');





fineRouter.route('/')
.get(function (req, res, next) {
  operations.findAll(function(result){
    if(result){
      res.send({fine:result});
    }
  });
});
fineRouter.route('/:id')
.delete(function (req, res, next) {
  operations.DeleteFine(req.params.id,function(result){
    if(result){
      res.send({fine:result});
    }
    else{
        res.send({fine:"failure"});
    }
  });
});






















module.exports = fineRouter;
