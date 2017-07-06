var express = require('express');
var router = express.Router();
var orderRouter = express.Router();
var operations = require('../controller/orderController');
var verify = require('../routes/verify');


orderRouter.route('/check/:id')
.get(function(req,res,next){
    var email = req.params.id;
    console.log(email);
    operations.checkExistingOrder(email,function(result){
        if(result)
        {   console.log(result);
            res.json({count:result});
        }
        else {
            res.json({count:0});
        }
    });
});





orderRouter.route('/')
.post(verify.verifyUser,function(res,req,next){
    var ary = req.body;
    operations.NewOrder(ary,function(result){
        if(result){
            res.json({success:true});
        }
        else{
            res.json({success:false});
        }

    });
});
orderRouter.route('/')
.get(verify.verifyUser,function(req,res,next){
    operations.findOrders(function(result){
        if(result){
            res.json({order:result});
        }
        else {
        res.json({success:false});
        }
    });
});



module.exports = orderRouter;
