var mongoose = require('mongoose');
var Order = require('../models/order_info');
var Book = require('../models/book_info');
var mail = require('../routes/mail');
var Fine = require('../models/fineManagement');
var Track = require('../models/track_order');


exports.checkExistingOrder=function(email,callback){
/*Order.remove({},function(err){if(err)throw err;});
    /*Order.find({},function(err,res){
        console.log(res);
    });*/
    /*Book.find({},function(err,res){
        console.log(res);
    });*/



    /*Book.remove({},function(err){if(err)throw err;});*/
        /*Order.find({},function(err,res){
            console.log(res);
        });*/
/*Fine.remove({},function(err){if(err)throw err;});*/
/*    Fine.find({},function(err,res){
        if(err)
        throw err;

        console.log(res);

    });*/
    /*Track.find({},function(err,res){
        if(err)
        throw err;
        console.log(res);
    });*/
   /*Book.findByIdAndUpdate("595d16e615a6e81392ff802e", {
            $set: {
                status: 'not available'
            }
        })
        .exec(function (err, book) {
            if (err) throw err;
            console.log('Updated Book!');
            console.log(book);
            callback(book);
        });
        /*Track
        */











    Order.find({$or:[{status:"Accepted"},{status:"Approved"},{status:"Requested"}]},{email:email},function(err,res){
        if(err)
        throw err;
        console.log(res.length);
        var length=res.length;
        callback(length);
    });
}


exports.findOrders=function(callback){
    Order.find({$or:[{status:"Requested"},{status:"Approved"},{status:"Accepted"}]},function(err,response){
        if(err)
        throw err;
        callback(response);
    });
}

exports.changeStatusOrder=function(data,callback){
    Order.findByIdAndUpdate(data.order_id, {
            $set: {
                status: data.status
            }
        })
        .exec(function (err, order) {
            if (err) throw err;
            mail.mailSend(data.email,"The status of the order with reference to order id "+data.order_id+
            "has been changed to "+data.status,"New status of the order");
            callback(order);
        });

}
exports.findOrderWithStatus=function(order_id,status,callback){
    Order.findOne({_id:order_id,status:status},function(err,response){
        if(err)
        throw err;
        callback(response);
    });
}
