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






















module.exports = fineRouter;
