var mongoose=require("mongoose");
var Schema=mongoose.Schema;
userSchema=new Schema({
 
    unique_id:Number,
    email:String,
    username:String,
    password: String,
	password_Confirmation: String


}),

User=mongoose.model('User',userSchema);

module.exports=User;