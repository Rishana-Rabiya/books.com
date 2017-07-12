var mongoose = require('mongoose');
var Order = require('../models/order_info');
var Book = require('../models/book_info');
var mail = require('../routes/mail');
var Fine = require('../models/fineManagement');
var Track = require('../models/track_order');
var User = require('../models/users.js');

exports.checkExistingOrder=function(email,callback){



/*Order.remove({},function(err){if(err)throw err;});
    Order.find({},function(err,res){
        console.log("order",res);
    });*/
    /*Book.find({},function(err,res){
        console.log("book",res);
    });*/

    /*User.find({},function(err,res){
        console.log(res);
    });*/

    /*Book.remove({},function(err){if(err)throw err;});
        /*Order.find({},function(err,res){
            console.log(res);
        });*/
/*Fine.remove({},function(err){if(err)throw err;});*/
  /* Fine.find({},function(err,res){
        if(err)
        throw err;

        console.log("fine",res);

    });*/
    /*Track.remove({},function(err){if(err)throw err;});
   Track.find({},function(err,res){
        if(err)
        throw err;
        console.log("track",res);
    });*/
   /*Book.findByIdAndUpdate("595fbd8134ab597f8179df20", {
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
*/
/*User.findByIdAndRemove(id,function(err,book){
    if(err) throw err
    if(book){
        callback(book);
    }

});*/
User.find({},function(err,user){
    if(err)
    throw err;
    console.log(user);
})










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
            mail.mailSend(data.email,"The status of the lending book-"+order.book_name+" ,with reference to order id   "+order.order_id+
            " has been changed to "+data.status,"New status of the order");
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


exports.findRequest=function(callback){
Order.find({status:"Requested"},function(err,res){
    if(err)
    throw err;
    console.log(res);
    callback(res);
});
}


exports.findStatusUser = function(email,callback){
    console.log(email);

    var date2 = +new Date() - 7*24*60*60*1000;
    var array = [];
    Track.find({status:"Requested",date:{$gte:date2}},function(err,res){
        if(err)
        throw err;
        console.log("here",res);
        if(res)
        {
            res.forEach(function(element,index){
                var id = element.order_id;
                console.log(email);
                Order.findOne({_id:id,email:email},function(err,result){
                    console.log(result);
                    if(result){
                        array.push(result);
                        console.log(array);
                        if(index==res.length-1){
                            callback(array);
                        }
                    }
                })

            });
        }

    });
}

exports.findOrderWithEmail=function(email,callback){
    var array =[];
    Order.find({email:email},function(err,response){
        if(err)
        throw err;

        if(response){
            response.forEach(function(element,index){
                Track.findOne({order_id:element._id,status:element.status},function(err,res){
                    console.log(res);
                    if(err)
                    throw err;
                    if(res){
                    var new1 ={
                        order_id:res.order_id,
                        status:res.status,
                        book_name:element.book_name,
                        date:res.date
                    }
                    console.log("index",index);
                    array.push(new1);
                    if(array.length==response.length){
                        callback(array);
                    }
                }


                });

            });
        }
    });
}

exports.orderSame=function(data,callback){
    console.log("inside the fuction",data);

        Order.aggregate(
            [{
                $match : {
                    isbn:data.isbn,
                    email:data.email,
                    $or:[{status:"Requested"},{ status:"Approved" },{ status:"Accepted"}]
                }
            }
        ]
        ,
        function(err,res){
            if(err)
            throw err;
            console.log("response",res);
            callback(res);
        });
    }
