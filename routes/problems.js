const express 						=	require("express")
,	  router 						=	express.Router({mergeParams:true})
,     Problem 						=   require("../models/problem")
,     UsrOwnedProblemStatements		=   require("../models/usr-list-of-problems")
,	  User							=   require("../models/user")
,     middleware					=   require("../middleware/index");

/*  
	RESTful API
	```````````
	index,
	new,
  	create,
	show,
	edit,
	put,
	delete
 */
//show all problems statements
router.get("/" , (req,res)=>{

	Problem.find({},{"problemDetails.problemName":1,"problemDetails.problemId":1}).sort('-created').limit(20).exec((err,problems)=>{
		//console.log(problems);
		res.render('showProblems',{problems:problems});
	});
});

//create a new problem statement
router.get("/new", (req,res)=>{
	res.render("createProblem");
});

//post a new probelem --- some work pending
router.post("/", middleware.isLoggedIn ,(req,res)=>{
	
	const problem = makeProblemStatement(req.body);

	//find the user first and update then problem statement and then usr-list-of-problems
	User.findOne({user:"mahendra"},(err,user)=>{
		if(err){
			console.log("user does not exits");
			res.send("user does not exits");
		}
		else{
			Problem.create(problem, (err, problem) => {
				if (err) {
					console.log(err);
					res.send("error in uploading problem..please try again");
				}
				else {
					//res.send("problem updated successfully");
					UsrOwnedProblemStatements.findOne({owner:"mahendra"}, (err,usrOwnedProblemStatements)=>{
						console.log(usrOwnedProblemStatements);
						if(err){
							console.log("cannot update useownedproblem statement");
							res.send("some error in useownedproblem statement updation");
						}
						if(!usrOwnedProblemStatements){
							//create a new user
							usrOwnedProblemStatementsPromise = createANewUserForUsrOwnedProblemStatement("mahendra");
							usrOwnedProblemStatementsPromise.then((usrOwnedProblemStatementsValue)=>{
								usrOwnedProblemStatements = usrOwnedProblemStatementsValue;
								usrOwnedProblemStatements.problemsOwned.push(problem)
								usrOwnedProblemStatements.save();
								//console.log(usrOwnedProblemStatements)
								res.send("all ok");
							});
						}
						else{
							usrOwnedProblemStatements.problemsOwned.push(problem);
							usrOwnedProblemStatements.save();
							res.redirect("/problems");
						}
							
					});
				}
			});
		}
	});
});
						
	
//show the problem in detail
router.get("/:id",(req,res)=>{
	Problem.findById(req.params.id, (err,problem)=>{
		if(err){
			//console.log("error in opening a problem with given id");
			res.status(400).send("error in getting problem");
		}
		else{
			res.render('showProblem',{problem:problem});
		}
	});
});


//req for - edit a problem
router.get("/:id/edit", middleware.isLoggedIn ,(req,res)=>{
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
});


//put a edit -- find by id and update the problem
router.put("/:id", middleware.isLoggedIn ,(req,res)=>{

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
router.delete("/:id" , middleware.isLoggedIn ,(req,res)=>{
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
	console.log(tmpProblem);
	//meta data for problem
	const problemDetails =  {
		owner 	    : tmpProblem.owner || "",
		problemName : tmpProblem.problemName || "",
		problemId 	: tmpProblem.problemId || ""
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
	
	//now get all the actual test cases
	const testCases = [];
	if(tmpProblem.testinput)
		for (let i = 0; i < tmpProblem.testinput.length ; i++){
			testCases.push({
				input  : tmpProblem.testinput[i],
				output : tmpProblem.testoutput[i]
			});
		}

	// Add another field to problemStatement and pass testCases as key
	problemStatement.testCases = testCases;

	// A complete problem object..we have store this in DB
 	const problem = {
 		problemDetails   : problemDetails,
		problemStatement : problemStatement,
	}
	 
	//console.log(tmpProblem.testinput);


 	return problem;
}


async function createANewUserForUsrOwnedProblemStatement(name) {
	
	UsrOwnedProblemStatements.create({owner:name} , (err,usrOwnedProblemStatements)=>{
		if(err){
			console.log("error in creating one");
		}
		else{
			console.log(usrOwnedProblemStatements);
			return usrOwnedProblemStatements;
			
		}
	});

}

module.exports = router;