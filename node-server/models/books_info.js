var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// User Schema
var Book = mongoose.Schema({
	ISBN: {
		type: String,
		required:true,
    unique:true
	},
	Book_Name: {
		type: String,
    required:true
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
    required:true
	},
  Release_year: {
    type:String
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
		required:true
  },
  edition:{
    type:String
  },
  stack_no:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
    //default:"available"
  },
	publisher :{
		type:String
	}

});
var Books = mongoose.model('Book', Book);
 module.exports = Books;
