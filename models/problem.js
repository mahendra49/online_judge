const mongoose = require("mongoose");

var problemSchema = new mongoose.Schema({
	
	//problem meta data
	problemDetails : {
		owner 	    : String,
		problemName : String,
		problemId 	: String,
		created 	: {
			type	: Date,
			default : Date.now
		}
	},

	//actual problem statement
	problemStatement:{
		statement      : String,
		input          : String,    // input details and constraints
		output	       : String,    // exptected output and explantion
		sampletestcase : {          // A sample test case with input and output   
			input  : String,
			output : String
		},
		testCases:[
			{
				input  :String,
				output :String
			}
		]
 	} 

});

module.exports = mongoose.model("Problem", problemSchema);