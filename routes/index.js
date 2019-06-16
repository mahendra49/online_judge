const express 	=	require("express")
,	    router 	  =	express.Router({mergeParams:true})	 
,     User      =   require("../models/user")
,	    session   =   require('express-session')
,     bcrypt	  =   require('bcrypt')
,	    _         =   require('lodash')
,     middleware=   require('../middleware/index');

router.get("/",(req,res)=>{
  console.log(req.session.user);
  res.render("home",{currentUser:req.session.user});
});

router.get("/login", middleware.isLogged ,(req,res)=>{
	res.render("login");
});

router.post("/login", middleware.isLogged ,async (req,res)=>{
  let user = await User.findOne({username:req.body.username})
  
  if(!user)
    return res.status(400).send({ auth: false, message:'incorrect username or password' });
  
  const validPassword = await bcrypt.compare(req.body.password , user.password);
  
  if (!validPassword) return res.status(400).send({ auth: false, message:'incorrect username or password' });
  
  const payload =  _.pick(user , ['_id','username','email'])
  
  req.session.user = payload;

  res.redirect('/');
  
});

router.get("/register", middleware.isLogged,(req,res)=>{
	res.render("register");
});

router.post("/register", middleware.isLogged ,(req,res)=>{
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
      res.redirect('/');
    });
});;

router.get('/logout',(req,res)=>{
  req.session.destroy(function(){
      console.log("user logged out.")
      res.redirect('/login');
  });
});

module.exports  = router;