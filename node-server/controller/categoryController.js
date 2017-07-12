var Category = require('../models/category_info');
var mongoose = require('mongoose');
var Book = require('../models/book_info');

exports.createCategory = function(data,callback){
  console.log(data);
  Category.findOne({CategoryName:data.name},function(err,res){
      if(err)
      throw err ;
      if(res)
      {
          return callback({flag:"exist"});
      }
      else{
          Category.create({
              CategoryName: data.name,
              CategoryStatus: "enable"
          },
          function(err,cat){
              if(err) throw err
              return callback({flag:cat});
          });
      }
   });
}
exports.findAllCategory = function(callback){
  Category.find({CategoryStatus:"enable"},function(err,cat){
    if(err) throw err
    callback(cat);
  });
}
exports.findDisabledCategory = function(callback){
  Category.find({CategoryStatus:"disable"},function(err,cat){
    if(err) throw err
    callback(cat);
  });
}


exports.changeCategory = function(data,callback){
    var id = data.id;
    var flag = data.flag;
    console.log(id,flag);
    if(flag =="enable"){
        Category.findOneAndUpdate({CategoryName:id}, {
            $set: {
                CategoryStatus: flag
            }
        })
        .exec(function (err, cat) {
            if (err) throw err;
            if(cat){
                Book.update({category:id},{
                        $set: {
                        status:"available"
                        }

                    },{"multi": true})
                    .exec(function (err, num) {
                        if (err) throw err;

                        console.log(num);
                        callback(num);
                });
            }

        });
    }
    else if(flag=="disable"){
        Category.findOneAndUpdate({CategoryName:id}, {
                $set: {
                    CategoryStatus: flag
                }
            })
            .exec(function (err, cat) {
                if (err) throw err;
                if(cat){
                    Book.update({category:id},{
                        $set: {
                            status:"not available"
                        }

                    },{"multi": true})
                    .exec(function (err, num) {
                        if (err) throw err;
                        console.log(num);
                        callback(num);
                    });
                }

            });

    }
}



exports.getAll = function(callback){
  Category.find(function(err,cat){
    if(err) throw err
    callback(cat);
  });
}




exports.deleteCategory = function(id,callback){
    Category.findOneAndRemove({CategoryName:id},function(err,cat){
        if(err) throw err
        if(cat){
            Book.deleteMany({category:id},function(err,res){
                if(err)
                throw err;
                callback(res);
            })
        }

    });
}

exports.updateCategory = function(data,callback){
    console.log("here");
    Category.findOne({CategoryName:data.new},function(err,res){
        if(err)
            throw err;
        if(res)
        {
            return callback({flag:"exist"});
        }
        else {
            Category.findOneAndUpdate({CategoryName:data.name}, {
                $set: {
                    CategoryName:data.new
                }
            })
            .exec(function (err, cat) {
                if (err) throw err;
                if(cat){
                    console.log(cat);
                    Book.update({category:data.name},{
                        $set: {
                            category:data.new
                        }

                    },{"multi": true})
                    .exec(function (err, num) {
                        if (err) throw err;
                        console.log(num);
                        return callback({flag:num});
                    });
                }

            });
        }
    });

}
