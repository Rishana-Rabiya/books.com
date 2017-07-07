var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Fine = mongoose.Schema({
    order_id :{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    Dof :{
        type:Date,
        default:Date.now,
        required:true
    },
    DoIR :{
        type:Date,
        default:Date.now,
        default: +new Date() + 15*24*60*60*1000
    },
    DoR :{
        type:Date
    },
    fine:{
        type:Number,
        default:0
    }



});
var Fine= mongoose.model('Fine',Fine);
 module.exports = Fine;
