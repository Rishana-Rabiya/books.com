var express = require('express');
var router = express.Router();
var orderRouter = express.Router();
var operations = require('../controller/orderController');
var verify = require('../routes/verify');


bookRouter.route('/:id')
.get(verify.verifyUser,function(req,res,next){
    var email = req.params.id;
    operations.checkExistingOrder= function(email,function(result){
        if(result)
        {
            res.json({count:result});
        }
    });
});



module.exports = orderRouter;
