const middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.session.user){
        return next();
    }
    res.redirect("/login");
}

middlewareObj.isLogged =function isLogged(req,res,next){
    
    if(!req.session.user){
       return next();
    } 

    res.redirect("/user");
}
/*
function checkSign(req, res , next){
   if(!req.session.user){
      next();     //If session exists, proceed to page
   } 
   else{
      res.send("already signed in bro");
   }
}*/


module.exports = middlewareObj;