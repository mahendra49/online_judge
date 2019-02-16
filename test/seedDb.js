const   mongoose                  =  require("mongoose")
,       Problem                   = require("../models/problem")
,       UsrOwnedProblemStatements = require("../models/usr-list-of-problems")
,       Result                    = require("../models/results");

mongoose.connect("mongodb://localhost/online_judge", { useNewUrlParser: true });


Problem.remove({},(err,done)=>{
    if(err){
        console.log("err");
    }
    console.log("deleted all problems");
});


UsrOwnedProblemStatements.remove({}, (err, done) => {
    if (err) {
        console.log("err");
    }
    console.log("usr owned problem statements");
});


Result.remove({}, (err, done) => {
    if (err) {
        console.log("err");
    }
    console.log("results db deleted");
});