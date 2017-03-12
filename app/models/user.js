/**
 * Created by SiuWongLi on 17/3/11.
 */
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var UserSchema = new Schema({
    username:{type:String,unique:true},
    password:String,
    type:Number,
    major:String,
    className:String,
    sex:String,
    name:String,
    studentId:String
});
module.exports= mongoose.model('user',UserSchema);