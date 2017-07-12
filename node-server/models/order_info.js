




var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var Order = mongoose.Schema({
	order_id:{
		type:String,
		required :true
	},
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
  	},
	book_name:{
		type:String,
		required:true
	},
	isbn :{
		type:String

	}
});




var Orders= mongoose.model('Order',Order);
 module.exports = Orders;
