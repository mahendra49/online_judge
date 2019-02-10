const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	user:{
		type:String,
		unique:true,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	}

});


module.exports = mongoose.model("User", userSchema);