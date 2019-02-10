const express 	=	require("express")
,	  router 	=	express.Router({mergeParams:true});	 



router.get("/",(req,res)=>{
	res.send("welcome page");
});

router.get("/login", (req,res)=>{
	res.send("login page");
});

router.post("/login" , (req,res)=>{
	res.send("success login");
});

router.get("/register", (req,res)=>{
	res.send("form for register");
});

router.post("/register", (req,res)=>{
	res.send("succes register");
});

module.exports  = router;