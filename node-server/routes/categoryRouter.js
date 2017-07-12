var express = require('express');
var router = express.Router();
var catRouter = express.Router();
var operations = require('../controller/categoryController');
var verify = require('../routes/verify');

catRouter.route('/create')
.post(verify.verifyUser,function (req, res, next) {
  operations.createCategory(req.body,function(result){
    if(result.flag=="exist"){
      res.json({flag:"exist"});
    }
    else {
        res.json({flag:result});
    }
  });
});

catRouter.route('/create')
.put(verify.verifyUser,function (req, res, next) {
    operations.updateCategory(req.body,function(result){
        if(result.flag=="exist"){
      res.json({success:false});
    }
    else {
        res.json({success:true})
    }
  });
});

catRouter.route('/find')
.get(verify.verifyUser,function (req, res, next) {
  operations.findAllCategory(function(result){
    if(result){
      res.send({message:result});
    }
    else {
        res.json({success:false})
    }
  });
});


catRouter.route('/find/:id')
.get(verify.verifyUser,function (req, res, next) {
    if(req.params.id=="enable"){
        operations.findAllCategory(function(result){
            if(result){
                res.send({message:result});
            }
            else {
                res.json({success:false})
            }
        });
    }
    else if(req.params.id=="disable")
    {
        operations.findDisabledCategory(function(result){
            if(result){
                res.send({message:result});
            }
            else {
                res.json({success:false})
            }

        });
    }
})

.delete(verify.verifyUser,function(req,res,next){
    var name = req.params.id;
    operations.deleteCategory(name,function(result){
        if(result){
            res.json({status:"success"});
        }
        else{
                res.json({status:"failure"});
            }

    });
});



catRouter.route('/action')
.put(verify.verifyUser,function(req,res,next){
        operations.changeCategory(req.body,function(result){
            if(result){
                res.send({message:"success"});
            }
            else {
                res.json({success:false})
            }
        });
    });




    catRouter.route('/all')
    .get(verify.verifyUser,function(req,res,next){
            operations.getAll(function(result){
                if(result){
                    res.send({categories:result});
                }
                else {
                    res.json({success:false})
                }
            });
        });
























module.exports = catRouter;
