var express = require('express');
var router = express.Router();
var catRouter = express.Router();
var operations = require('../controller/categoryController');
var verify = require('../routes/verify');

catRouter.route('/create')
.post(verify.verifyUser,function (req, res, next) {
  operations.createCategory(req.body,function(result){
    if(result){
      res.json(success=true);
    }
  });
});

catRouter.route('/find')
.get(verify.verifyUser,function (req, res, next) {
  operations.findAllCategory(function(result){
    if(result){
      res.send({message:result});
    }
  });
});





















module.exports = catRouter;
