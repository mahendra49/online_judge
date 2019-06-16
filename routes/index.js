const express 	=	require("express")
,	    router 	  =	express.Router({mergeParams:true})	 
,     User      =   require("../models/user")
,	    session   =   require('express-session')
,     bcrypt	  =   require('bcrypt')
,	    _         =   require('lodash');

router.get("/",(req,res)=>{
	res.send("welcome page");
});

router.get("/login", (req,res)=>{
	res.render("login");
});

router.post("/login", async (req,res)=>{
  let user = await User.findOne({username:req.body.username})
  
  if(!user)
    return res.status(400).send({ auth: false, message:'incorrect username or password' });
  
  const validPassword = await bcrypt.compare(req.body.password , user.password);
  
  if (!validPassword) return res.status(400).send({ auth: false, message:'incorrect username or password' });
  
  const payload =  _.pick(user , ['_id','username','email'])
  
  req.session.user = payload;

  res.status(200).send({ auth: true, ...payload});
  
});

router.get("/register", (req,res)=>{
	res.render("register");
});

router.post("/register", (req,res)=>{
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
 
  User.create({
      username : req.body.username,
      email : req.body.email,
      password : hashedPassword
    },
    function (err, user) {

      if (err){
        return res.status(400).send({error:true , message:'username or email already exists'})
      }

      const payload =  _.pick(user , ['_id','username','email'])
      req.session.user = payload;
      res.status(200).send({ auth: true, ...payload});
  
    });
});;

module.exports  = router;