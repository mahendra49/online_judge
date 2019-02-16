/*i'm not including this in users.js 
just keeping things simple
all the problems statements a user owns are stored here
*/

const mongoose 	= require("mongoose");
		

var OwnerofProblems = new mongoose.Schema({

	//owner is a "User" from user.js
	owner: {
		type   :String,
		
	},

	//list of problems owned
	problemsOwned : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Problem"
		}
	]                             

});

module.exports = mongoose.model("OwnerOfProblem", OwnerofProblems);

