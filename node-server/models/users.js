var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


// User Schema
var UserSchema = mongoose.Schema({
	email: {
		type: String,
		required:true,
    unique:true
	},
	password: {
		type: String,
    required:true
	},
  firstName: {
		type: String
	},
	lastName: {
		type: String
	},
  type: {
    type:String,
    required:true

  }
});
UserSchema.methods.encryptPassword = function(password) {
return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/*UserSchema.methods.validPassword = function( pwd ) {

    return ( this.password === pwd );
};*/



var User = mongoose.model('User', UserSchema);
 module.exports = User;
