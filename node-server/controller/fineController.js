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


exports.Return = function(data,callback){
  console.log(data);
  Fine.findOne({order_id:data.order_id},function(err,res){
     if(err)
     throw err;
     console.log(res);
     if(res){
         Fine.findByIdAndUpdate(res._id, {
             $set: {
                 DoR: Date()
                }
            },{new:true})
            .exec(function (err, fine) {
                if (err) throw err;
                console.log(fine);
                if(fine){
                    var DoR = fine.DoR;
                    var DoIR = fine.DoIR;
                    var timeDiff = Math.abs(DoR.getTime() - DoIR.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    Fine.findByIdAndUpdate(res._id,{
                        $set: {
                            fine: diffDays
                        }
                    }).exec(function (err, result) {
                        if(err)
                        throw err;
                        callback(result);
                    });
                }
            });
        }

    });
}


exports.findAll = function(callback){
    Fine.find({},function(err,fine){
        if(err) throw err
        if(fine){
            callback(fine);
        }

    });
}






















         /* .exec(function (err, fine) {
              console.log("fien",fine);
              if (err) throw err;
              if(fine){
              var DoA = fine.Dof;
              var DoIR = fine.DoIR;
              var timeDiff = Math.abs(DoA.getTime() - DoIR.getTime());
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              Fine.findByIdAndUpdate(res._id,{
                  $set: {
                      fine: diffDays
                  }
              }).exec(function (err, result) {
                  if(err)
                  throw err;
                  callback(result);
              });
                }

      });
  }
  });


}
*/
