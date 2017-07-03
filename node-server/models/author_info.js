var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Author = mongoose.Schema({
	Afname: {
		type: String,
		required:true
	},
Alname: {
		type: String

  }
});


var Author = mongoose.model('Author', Author);
module.exports = Author;
