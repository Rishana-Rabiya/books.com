var Track = require('../models/track_order');
var mongoose = require('mongoose');

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
