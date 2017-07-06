var Fine = require('../models/fineManagement');
var mongoose = require('mongoose');

exports.Accept = function(data,callback){
  console.log(data);
  Fine.create({
    order_id: data.order_id
  },
  function(err,fine){
    if(err) throw err
    callback(fine);
  });
}
