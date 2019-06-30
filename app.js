const express 			= 		require("express")
,	  app 				=       express()
,	  bodyparser  		= 		require("body-parser")
,	  mongoose 			=		require("mongoose")	
,     Problems      	= 		require("./routes/problems")
,	  Index  			=		require("./routes/index")
,	  SubmitSolution	=		require("./routes/submitSolution")
,     Result            =  		require("./models/results");



//connect to database..mongodb in this case
mongoose.connect("mongodb://localhost/online_judge", {useNewUrlParser:true});

//templating engine is "ejs"
app.set("view engine","ejs");


//app configurations
app.use(express.static(__dirname + '/public'));                //serve static files
app.use(bodyparser.urlencoded({extended:true}));			   //true means any data type value in key:value
app.use(bodyparser.json());                                    //parse json data
app.use(require("express-sanitizer")());                       //sanitize unwanted text like scripts tags etc ..security purpose
app.use(require("express-session")({                           //sessions
	secret:"hey there, you still can't hack this",
	resave:false,
	saveUninitialized:false
}));

// -- /,login register, routes
app.use("/", Index);

//route all the url having "/problems/.."
app.use("/problems", Problems);

app.get('/results',(req,res)=>{
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

//all submitted solutions will be running here
app.use("/submit", SubmitSolution);

app.listen(process.env.PORT, process.env.IP ,()=>{
	console.log("server running on "+ process.env.IP + ":"+process.env.PORT);
});




