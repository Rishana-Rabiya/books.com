var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var exUserRouter = express.Router();
var operation = require('../controller/exUserController');
var verify = require('../routes/verify');
var operations = require('../controller/bookController');
var orderOperations = require('../controller/orderController');
var fineOperations = require('../controller/fineController');
var trackOperations = require('../controller/trackOrderController');



exUserRouter.route('/create')
.post(verify.verifyUser,function (req, res, next) {
  operation.createUser(req.body,function(result){
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
});


exUserRouter.route('/')
.post(verify.verifyUser,function (req, res, next) {
    console.log("inside the order updation");
    var data = req.body;
    console.log(data.status);

     if(data.status=="Accepted"){
         orderOperations.findOrderWithStatus(data.order_id,"Approved",function(resp){
             if(resp){
                 fineOperations.Accept(data,function(result){
                     orderOperations.changeStatusOrder(data,function(order){
                         if(order){
                             trackOperations.trackOrder(data,function(result){
                                 if(result){
                                 res.json({status:result.status});
                             }
                             else {
                                 res.json({status:"failure"});
                             }
                             });

                         }

                     });

                 });
             }
             else {
                res.json({status:"failure"});
             }
         });
     }
     else if(data.status=="Rejected")
     {
         operations.makeAvailable(data.books_id,function(resp){
             if(resp){
                 orderOperations.changeStatusOrder(data,function(order){
                     if(order){
                         trackOperations.trackOrder(data,function(result){
                             if(result)
                            res.json({status:result.status});
                         });
                     }

                 });

             }
             else{
                res.json({status:"failure"});
             }
         });
     }
     else if(data.status=="Returned"){
         orderOperations.findOrderWithStatus(data.order_id,"Accepted",function(resp){
              if(resp){
                  fineOperations.Return(data,function(result){
                      if(result){
                          operations.makeAvailable(data.books_id,function(resp){
                              if(resp){
                                  orderOperations.changeStatusOrder(data,function(order){
                                      if(order){

                                          trackOperations.trackOrder(data,function(result){
                                              if(result)
                                              res.json({status:result.status});
                                          });

                                      }

                                  });
                                }
                                else {
                                     res.json({status:"failure"});
                                }
                            });
                        }
                    });
                }

                else {
                    res.json({status:"failure"});
                 }
            });

        }
     else if(data.status=="Approved"){
         orderOperations.findOrderWithStatus(data.order_id,"Requested",function(resp){
              if(resp){
                  console.log("inside approve");
                  orderOperations.changeStatusOrder(data,function(order){
                      if(order){
                          trackOperations.trackOrder(data,function(result){
                              if(result)
                              res.json({status:result.status});
                          });
                      }
                  });
              }
              else {
                 res.json({status:"failure"});
              }
          });

      }
     else {
        res.json({status:"failure"});
     }
});



exUserRouter.route('/')
.get(function (req, res, next) {

    trackOperations.getCount(function(ary,reqCount){
            if(ary||reqCount){
            res.json({count:reqCount,ary:ary});
            }
    });
});


module.exports = exUserRouter;
