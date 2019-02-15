const express  =  require("express")
,     router   =  express.Router({mergeParams:true})
,     Problem  =  require("../models/problem")
,     fs       =  require("fs")
,     cp       =  require("child_process")
,     path     =  require("path");



router.post("/:id" ,(req,res)=>{
    
    //find problem by id
    const problemId         = req.params.id;
    const solutionofUser    = req.body.solution;
    const selectedLanguage  = req.body.selectedLanguage;

    //get the user also who submitted from req.user
    //const user              = req.user.user;  
    //console.log(solutionofUser);

    //generate a file unique file name..i'm taking date+username;
    const tmpfile  = Date.now()+"mahendra";


    Problem.findById(problemId , (err,problem)=>{
        if(err){
            console.log("error in submitting solution");
            res.send("falied");
        }
        else{
            fs.writeFile(__dirname + "/.." + "/tmpfiles/" +  tmpfile + ".cpp", solutionofUser, (err) => {
                if (err) {
                    console.log("error in writing to file in solution submtting");
                    console.log(err);
                }
                else {
                    const compileGCC = cp.spawnSync("g++", ["./tmpfiles/"+tmpfile+".cpp", "-o", "./tmpfiles/"+tmpfile+".out"]); //the array is the arguments
                    console.log("input is : ");
                    if(compileGCC.status!=0){
                        console.log(`compile error ${compileGCC.stderr.toString()}`);
                        res.send(`compile error ${compileGCC.stderr.toString()}`);
                    }
                    else{
                        //console.log(problem.problemStatement.sampletestcase.input);
                        const runGCC = cp.spawnSync("./tmpfiles/" + tmpfile + ".out", { input: problem.problemStatement.sampletestcase.input});
                        console.log(runGCC.stdout.toString());
                        console.log(problem.problemStatement.sampletestcase.output);
                        
                        //testing purpose
                        //var ss = fs.writeFileSync("../mahendra.txt", runGCC.stdout.toString().replace(/[^\S\r\n]+$/gm, ""));
                        //var ss1 = fs.writeFileSync("../mahendra1.txt", problem.problemStatement.sampletestcase.output.replace(/[^\S\r\n]+$/gm, ""));
                        
                        //match the actual output with user output
                        if (runGCC.stdout.toString().replace(/[^\S\r\n]+$/gm, "") == problem.problemStatement.sampletestcase.output.replace(/[^\S\r\n]+$/gm, "")){
                            res.send("test case passes");
                        }
                        else{
                            res.send("test case failed");
                        }
                        //res.send(runGCC.stdout.toString());
                    }
                }
                
            });
            
        }
    }); 
    
    
    /*
    //Legecy code

    fs.writeFile(__dirname+"/.."+"/tmpfiles/sample.cpp", solutionofUser, (err)=>{
        if (err) {
            console.log("error in writing to file in solution submtting");
            console.log(err);
        }
        else {
            var compileGCC = cp.spawnSync("g++", ["./tmpfiles/sample.cpp", "-o", "./tmpfiles/sample.out"]); //the array is the arguments
            var runGCC = cp.spawnSync("./tmpfiles/sample.out");
            res.send(runGCC.stdout.toString())
        }
    });
    */

});


module.exports = router;
