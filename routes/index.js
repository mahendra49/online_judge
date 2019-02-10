const express 	=	require("express")
,	  router 	=	express.Router({mergeParams:true})	 
,     User      =   require("../models/user");


router.get("/",(req,res)=>{
	res.send("welcome page");
});

router.get("/login", (req,res)=>{
	console.log("login page");
});

router.post("/login" , (req,res)=>{
	
	const usrDetails  =  {
		user:req.body.user,
		password:req.body.password
	}
	res.send("ok done");
});

router.get("/register", (req,res)=>{
	res.send("form for register");
});

router.post("/register", (req,res)=>{
	
	const usrDetails  =  {
		user:req.body.user,
		password:req.body.password,
		email:req.body.email
	}
	User.create(usrDetails , (err,user)=>{
		if(err)
			console.log(err);
		res.send("user stored");
	});

	console.log(usrDetails);
});

module.exports  = router;