const express 	=	require("express")
,	  router 	=	express.Router({mergeParams:true})
,     Problem 	=   require("../models/problem"); 


//show all problems statements
router.get("/" ,(req,res)=>{
	Problem.find({},{"problemDetails.problemName":1,"problemDetails.problemId":1}).sort('-created').limit(20).exec((err,problems)=>{
		res.send(problems);
	});
});

//create a new problem statement
router.get("/new", (req,res)=>{
	res.send("create new problems");
});

//post a new probelem
router.post("/", (req,res)=>{
	
	const problem = makeProblemStatement(req.body);

 	Problem.create(problem, (err,problem)=>{
 		if(err){
 			console.log(err);
 			res.send("error in uploading problem..please try again");
 		}
 		else{
 			res.send("problem updated successfully");
 		}
 	});

});

router.get("/:id",(req,res)=>{
	Problem.findById(req.params.id, (err,problem)=>{
		if(err){
			//redirect here
			console.log("error in opening a problem with given id");
		}
		else{
			res.send(problem);
		}
	});
});


//req for - edit a problem
router.get("/:id/edit", (req,res)=>{
	Problem.findById(req.params.id , (err,problem)=>{
		if(err){
			console.log(err);
		}
		//check if the user is the owner of this problem statement
		if(problems.problemDetails.owner!=req.user.user){
			res.send("you are not the owner of the problem statement");
		}
		else{
			res.send(problems);
		}

	});
	res.send("edit problem statment");
});


//put a edit -- find by id and update the problem
router.put("/:id", (req,res)=>{

	const problem = makeProblemStatement(req.body);

	Problem.findByIdAndUpdate(req.params.id, problem, (err,problem)=>{
		if(err){
			console.log("error in puting the problem");
		}
		//check if he owns the problem
		if(problem.problemDetails.owner!=req.user.user){
			res.send("failed to updating problem");
		}
		else{
			//simply redirect from here
			res.send("success");
		}
	});
});

//delete a problem
router.delete("/:id" , (req,res)=>{
	Problem.findById(req.params.id, (err,problem)=>{
		if(err){
			console.log("err in remove problem");
		}
		//error or cannot delete if not present or not the owner
		if(!problem || problem.problemDetails.owner!=req.user.user ){
			res.send("cannot delete");
		}
		else{
			res.send("successfully removed problem");
		}

	});
});

function makeProblemStatement(tmpProblem) {
	//meta data for problem
	const problemDetails =  {
		owner 	    : tmpProblem.owner,
		problemName : tmpProblem.problemName,
		problemId 	: tmpProblem.problemId
	}

	const problemStatement = {
		statement      : tmpProblem.statement,
		input          : tmpProblem.input,     // input details and constraints
		output	       : tmpProblem.output,    // exptected output and explantion
		sampletestcase : {                   // A sample test case with input and output   
			input  : tmpProblem.sampleinput,
			output : tmpProblem.sampleoutput
		}
 	}
	// A complete problem object..we have store this in DB
 	const problem = {
 		problemDetails   : problemDetails,
 		problemStatement : problemStatement 
 	}

 	return problem;
}

module.exports = router;