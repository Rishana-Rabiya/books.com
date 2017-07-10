var Users = require('../models/users');
var mongoose = require('mongoose');


exports.findPendingUsers = function(callback){
  Users.find({type:"pending_user"},{firstName:1,lastName:1,email:1},function(err,user){
    if(err) throw err
    callback(user);
  });
}
exports.findUsers = function(callback){
  Users.find({type:"user"},{firstName:1,lastName:1,email:1},function(err,user){
    if(err) throw err
    callback(user);
  });
}

exports.disableUser = function(id,callback){
    Users.findByIdAndUpdate(id, {
            $set: {
                type:'pending_user'
            }
        })
        .exec(function (err, user) {
            if (err) throw err;
            console.log('Disabled!');
            console.log(user);
            callback(user);
        });
}
exports.enableUser = function(id,callback){
    Users.findByIdAndUpdate(id, {
            $set: {
                type:'user'
            }
        })
        .exec(function (err, user) {
            if (err) throw err;
            console.log('Enabled!');
            console.log(user);
            callback(user);
        });
}
