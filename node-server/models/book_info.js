var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Book = mongoose.Schema({
	book_id: {
		type:String,
		required:true
	},
	isbn : {
		type: String,
		required:true
	},
	Book_Name: {
		type: String,
    	required:true
	},
 category: {
	  type: String,
    	required:true
	},
  Release_year: {
    type:String
  },
  author:{
    type:String,
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
    required:true,
    default:"available"
  },
	publisher :{
		type:String
	},
	image :{
		type:String,
		default:"images/hi2.jpg"
	}

});
var Books = mongoose.model('Book', Book);
module.exports = Books;
