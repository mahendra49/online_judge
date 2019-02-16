const express  =  require("express")
,     router   =  express.Router({mergeParams:true})
,     Problem  =  require("../models/problem")
,     fs       =  require("fs")
,     cp       =  require("child_process")
,     path     =  require("path")
,     Result   =  require("../models/results");

//submitted solution are handled here

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
                        //console.log(`compile error ${compileGCC.stderr.toString()}`);
                        res.send(`compile error ${compileGCC.stderr.toString()}`);
                        removeFile("./tmpfiles/" + tmpfile + ".cpp");
                    }
                    else{
                        //console.log(problem.problemStatement.sampletestcase.input);
                        const runGCC = cp.spawnSync("./tmpfiles/" + tmpfile + ".out", { 
                            input   : problem.problemStatement.sampletestcase.input,
                            timeout : 2000
                        });
                        console.log(runGCC.stdout.toString());
                        console.log(problem.problemStatement.sampletestcase.output);
                        
                        /*
                        //testing purpose
                        //var ss = fs.writeFileSync("../mahendra.txt", runGCC.stdout.toString().replace(/[^\S\r\n]+$/gm, ""));
                        //var ss1 = fs.writeFileSync("../mahendra1.txt", problem.problemStatement.sampletestcase.output.replace(/[^\S\r\n]+$/gm, ""));
                        
                        */
                       
                        //result of submission 1 - passes , 0 - failed 
                        let result;
                       
                        //test for signals ie..for Timeout , Segmentation fault
                        if (runGCC.signal == "SIGTERM"){
                            res.send("timout error");
                            
                        }
                        else if (runGCC.signal == "SIGSEGV"){
                            res.send("SIGSEGV fault");
                        }
                        //match the actual output with user output
                        else if (runGCC.stdout.toString().replace(/[^\S\r\n]+$/gm, "") == problem.problemStatement.sampletestcase.output.replace(/[^\S\r\n]+$/gm, "")){
                            res.send("test case passes");
                            result = 1;
                            updateResult(problem , result);
                        }
                        else{
                            res.send("test case failed");
                            result = 0;
                            updateResult(problem , result);
                        }

                        //remove ".cpp" and ".out" generated files for C++
                        removeFile("./tmpfiles/" + tmpfile + ".cpp");
                        removeFile("./tmpfiles/" + tmpfile + ".out");
                    }
                }

            });
            
        }
    }); 
});

//to remove the file after executing
function removeFile(fileName) {
    fs.unlink(fileName, function (err) {
        if (err) {
            console.error(err);
        }
        console.log('File has been Deleted');
    });                                                            
}
    
/* 
    username - name of user who submitted the solution
    problem  - the problem 
    result   - result of the submission
*/
function updateResult(problem , result) {
    
    const resultOfSubmission = {
        user        : "mahendra",
        problemId   : problem._id,
        result      : result
    };

    Result.create(resultOfSubmission , (err,result)=>{
        if(err){
            console.log("err in updating the result");
        }
        console.log("result updated");
    });

}
            

module.exports = router;
                

