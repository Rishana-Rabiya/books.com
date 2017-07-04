var mongoose = require('mongoose');
var Order = require('../models/order_info');


exports.checkExistingOrder=function(email,callback){
    Order.find({$or:[{status:"Accepted"},{status:"Approved"},{status:"Requested"}]},{email:email},function(err,res){
        if(err)
        throw err;
        console.log(res.length);
        var length=res.length;
        callback(length);
    });
}

exports.NewOrder = function(ary,callback){
    var len = ary.length;
    var email = ary[len-1];
    var id = '';
    for(i=0;i<len-1;i++){
        Order.create({
            email:email,
            book_id:ary[i],
            status:"Requested",
        },
    function(err,res){
        if(err)
        throw err;
        if(i==len-1){
            callback(res);
        }
    });
    }



}
