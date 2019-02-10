const express 	=	require("express")
,	  router 	=	express.Router({mergeParams:true});	 


//show all problems statements
router.get("/" ,(req,res)=>{
	res.status(200).send("problems statments");
});

//create a new problem statement
router.get("/new", (req,res)=>{
	res.send("create new problems");
});

//post a new probelem
router.post("/", (req,res)=>{
	res.send("post new problems");
});

//req for - edit a problem
router.get("/:id/edit", (req,res)=>{
	res.send("edit problem statment");
});

//put a edit
router.put("/:id", (req,res)=>{
	res.send("problem updated")
});

//delete the problem
router.delete("/:id" , (req,res)=>{
	res.send("delete a problems")
});



module.exports = router;