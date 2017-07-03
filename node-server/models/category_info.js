var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// User Schema
var category = mongoose.Schema({
	CategoryName :{
		type:String,
		required:true
	},
	CategoryStatus :{
    	type:String,
    	required:true
  	}
});
var Categories = mongoose.model('Category', category);
module.exports = Categories;
