var Category = require('../models/category_info');
var mongoose = require('mongoose');

exports.createCategory = function(data,callback){
  console.log(data);
  Category.create({
    CategoryName: data.name,
    CategoryStatus: "enable"
  },
  function(err,cat){
    if(err) throw err
    callback(cat);
  });
}
exports.findAllCategory = function(callback){
  Category.find({},function(err,cat){
    if(err) throw err
    callback(cat);
  });
}
