var mongoose = require('mongoose');
var Order = require('../models/order_info');
var operations = require('../controller/bookController');
var orderOperations = require('../controller/orderController');
var fineOperations = require('../controller/fineController');
var trackOperations = require('../controller/trackOrderController');



module.exports = function (io) {
    var message ={};
    io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    socket.on('order', function(data){

        temp(data,function(total,is){
            console.log(is.length);
            if(is.length!=0){
                message={status:"NOT_SET",array:is};
            }
            else{
                message={status:"ALL_SET"};
            }
            console.log("first");
            console.log(total);
            console.log("second");
            console.log(is);
            io.sockets.emit('response',message);
            io.sockets.emit('order',total);

        });
    });

});
var temp = function(data,callback){
    var len = data.length;
    var email=data[len-1];
    var total = [];
    var is = [];
    var ary =[]
    var i =0;
    data.forEach(function(element,index){
        console.log("index",index);
        if(index==(data.length-1)){
            console.log("last");
        }
        else {
            console.log("operatiodnfsd");
            console.log(element);
            operations.findAbook(element,function(result){
            if(result){
                console.log(result);
                console.log("available",result);
                Order.create({
                    email:email,
                    book_id:result._id,
                    status:"Requested",
                },
                function(err,response){
                    console.log("new order",response);
                    if(err)
                    throw err;
                    operations.bookAbook(result._id,function(res){
                        if(res){
                            total.push(response);
                            console.log(total);
                            if((is.length)+(total.length)==data.length-1){
                                return callback(total,is);
                        }
                        }
                });
            });
        }
            else {
                is.push(element);
                if((is.length)+(total.length)==data.length-1)
                    return callback(total,is);

            }
        });
    }
});
}
}
