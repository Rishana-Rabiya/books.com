




var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var Order = mongoose.Schema({
	status: {
		type: String,
        required:true
	},
	book_id: {
		type:mongoose.Schema.Types.ObjectId,
        required:true
	},
    email: {
    	type:String,
    	required:true
  	}
});




var Orders= mongoose.model('Order',Order);
 module.exports = Orders;
