const express 	=	require("express")
,	  router 	=	express.Router({mergeParams:true})
,     Result    =  	require("../models/results");


router.get('/',(req,res)=>{
	Result.find({},(err,results)=>{
		const nameScore = {};
		
		results.forEach((result)=>{
			console.log(result);
			if(nameScore[result.user]){
				nameScore.user++;
			}else{
				nameScore[result.user] = 1;
			}
		});

		let tmpresult = Object.keys(nameScore).map(function(key) {
  			console.log(key);
  			return {key:key, score:nameScore[key] }
		});
		tmpresult.sort(function(a, b) {
   		 	return a.score - b.score;
		});
		res.render('scores', {results:tmpresult});
	})
});

module.exports = router;