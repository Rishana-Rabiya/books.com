var User = require('../models/users');
var mongoose = require('mongoose');
var emailExistence = require('email-existence');



exports.createUser=function(data,callback){
    emailExistence.check(data.email, function(err,response){
        if(response){
            User.findOne({email:data.email},function(err,user){
                if (err) throw err;
                if(!user){
                    var newUser = new User();
                    newUser.email = data.email;
                    newUser.password = newUser.encryptPassword(data.password);
                    newUser.firstName =data.fname;
                    newUser.lastName=data.lname;
                    newUser.type = "exUser";
                    newUser.save(
                        function(err,res){
                            if(err)
                            throw err;
                            callback(res);
                    });
                }
                else {
                    callback("exist");
                }
            });
        } else {
            callback("invalid");
        }
    });

}
