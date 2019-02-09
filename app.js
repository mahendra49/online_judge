const express 		= 		require("express")
,	  app 			=       express()
,	  bodyparser  	= 		require("body-parser")
,	  mongoose 		=		require("mongoose");	


//connect to database..mongodb in this case
mongoose.connect("mongodb://localhost/online_judge", {useNewUrlParser:true}, ()=>{
	console.log("connected to DB");
});

//templating engine is "ejs"
app.set("view engine","ejs");


//app configurations
app.use(express.static(__dirname + '/public'));                // serve static files
app.use(bodyparser.urlencoded({extended:true}));			   // parse deep in form (nested json for example)
app.use(bodyparser.json());                                    //parse json data
app.use(require("express-sanitizer")());                       //sanitize unwanted text like scripts tags etc ..security purpose
app.use(require("express-session")({                           //sessions
	secret:"hey there, you still can't hack this",
	resave:false,
	saveUninitialized:false
}));


app.get("/", (req,res)=>{
	res.send("holla");
});

app.listen(process.env.PORT, process.env.IP ,()=>{
	console.log("server running on "+process.env.IP + ":"+process.env.PORT);
});


