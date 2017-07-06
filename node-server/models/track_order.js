var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var Track_order = mongoose.Schema({
	order_id: {
		type: String,
		required:true,
    	
	},
status: {
		type: String,
    	required:true
	},
	date: {
		type: Date
    	default:Date.now
	}
});



var Track_orders = mongoose.model('Track_order', Track_order);
 module.exports = Track_orders;
