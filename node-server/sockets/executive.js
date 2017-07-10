var mongoose = require('mongoose');
var Order = require('../models/order_info');
var operations = require('../controller/bookController');
var orderOperations = require('../controller/orderController');
var fineOperations = require('../controller/fineController');
var trackOperations = require('../controller/trackOrderController');
//var siofu = require("socketio-file-upload");
var unique = require('../routes/unique');



module.exports = function (io) {
    var message ={};
    io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
//    var uploader = new siofu();
//    uploader.dir = "../uploads";
    //uploader.listen(socket);
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

            console.log(element);
            operations.findAbook(element,function(result){
            if(result){
                console.log(result);
                console.log("available",result);
                unique.idGenerator(function(id){
                    if(id){
                        Order.create({
                            order_id:id,
                            email:email,
                            book_id:result._id,
                            status:"Requested",
                            book_name:result.Book_Name
                        },
                        function(err,response){
                            console.log("new order",response);
                            if(err)
                            throw err;
                            operations.bookAbook(result._id,function(res){
                                if(res){
                                    var temp = {order_id:response._id,
                                    status:response.status};
                                    trackOperations.trackOrder(temp,function(track){
                                        if(track){
                                            total.push(response);
                                            console.log(total);
                                            if((is.length)+(total.length)==data.length-1){
                                                return callback(total,is);
                                            }

                                        }
                                    });
                                }
                            });
                        });

                    }
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
