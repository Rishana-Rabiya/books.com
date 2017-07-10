var Track = require('../models/track_order');
var mongoose = require('mongoose');
var orderOperations = require('../controller/orderController');

exports.trackOrder = function(data,callback){

    Track.create({
        order_id :data.order_id,
        status :data.status

    },function(err,result){
        if(err)
        throw err;
        callback(result);
    });

}



exports.getCount = function(callback){
    var start = new Date();
    start.setHours(0,0,0,0);
    var reqCount = 0;
    var len =0;

    var end = new Date();
    end.setHours(23,59,59,999);

Track.aggregate(
    [{
        $match : {
            date: {$gte: start, $lt: end},
            $or:[{status:"Approved"},{status:"Rejected"},{status:"Returned"},{status:"Accepted"}]
        }
    },
    {
        $group : {
            _id : "$status",
            status:  {$first:'$status'},
            count: { $sum: 1 }
        }
    }
],function(err,resp){
    if(err)
    throw err;
    console.log("should be null",resp);
    if(resp){
        orderOperations.findRequest(function(result){
            var s = result;
            return callback(resp,result.length);
        });
    }
});
}
