




var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var Order = mongoose.Schema({
	order_id: {
		type: String,
		required:true,
    unique:true
	},
status: {
		type: String,
    required:true
	},
	book_id: {
		type: String
    required:true
	},
  email: {
    type:String,
    required:true

  }
});




var User = mongoose.model('User', UserSchema);
 module.exports = User;
