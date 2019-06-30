const express  =  require("express")
,     router   =  express.Router({mergeParams:true})
,     Problem  =  require("../models/problem")
,     fs       =  require("fs")
,     cp       =  require("child_process")
,     path     =  require("path")
,     Result   =  require("../models/results")
,     middleware = require('../middleware/index');

//show ide
router.get("/ide" ,(req,res)=>{
    res.render('ide');
});

router.get('/ide/:id',(req,res)=>{
    res.render('ide',{id:req.params.id});
});

router.post('/', middleware.isLoggedIn, (req,res)=>{
    runWithOutProblem(req,res);
});

router.post('/:id',middleware.isLoggedIn ,(req,res)=>{
    runWithProblem(req,res);
});

function runWithOutProblem (req,res){
    const tmpfile = Date.now();
    console.log(req.body);
    fs.writeFile(__dirname + "/.." + "/tmpfiles/" +  tmpfile + ".cpp" ,req.body.source_code ,(err)=>{
        if(err)
            return res.status(400).send("error");
        const compileGCC = cp.spawnSync("g++", ["./tmpfiles/"+tmpfile+".cpp", "-o", "./tmpfiles/"+tmpfile+".out"]); //the array is the arguments
        console.log("input is : ");
        if(compileGCC.status!=0){
            console.log(`compile error ${compileGCC.stderr.toString()}`);
            removeFile("./tmpfiles/" + tmpfile + ".cpp");
            return res.status(400).send(`compile error ${compileGCC.stderr.toString()}`);
        }
        const runGCC = cp.spawnSync("./tmpfiles/" + tmpfile + ".out", { 
            input   : req.body.stdin,
            timeout : 2000
        });
        console.log(runGCC.stdout.toString());
        let result;
                       
        //test for signals ie..for Timeout , Segmentation fault
        if (runGCC.signal == "SIGTERM"){
            res.send("timout error");
            
        }
        else if (runGCC.signal == "SIGSEGV"){
            res.send("SIGSEGV fault");
        }
        
        res.send({stdout:runGCC.stdout.toString()});
        //remove ".cpp" and ".out" generated files for C++
        removeFile("./tmpfiles/" + tmpfile + ".cpp");
        removeFile("./tmpfiles/" + tmpfile + ".out");           
    });
};


//submitted solution are handled here
function runWithProblem(req,res){
    console.log(req.body);
    
    //find problem by id
    const problemId         = req.params.id;
    const solutionofUser    = req.body.solution;
    const selectedLanguage  = req.body.selectedLanguage;

    //get the user also who submitted from req.user
    //const user              = req.user.user;  
    //console.log(solutionofUser);

    //generate a file unique file name..i'm taking date+username;
    const tmpfile  = Date.now()+req.session.user.username;


    Problem.findById(problemId , (err,problem)=>{
        if(err){
            console.log("error in submitting solution");
            res.send("falied");
        }
        else{
            fs.writeFile(__dirname + "/.." + "/tmpfiles/" +  tmpfile + ".cpp", req.body.source_code, (err) => {
                if (err) {
                    res.send('error')
                }
                else {
                    const compileGCC = cp.spawnSync("g++", ["./tmpfiles/"+tmpfile+".cpp", "-o", "./tmpfiles/"+tmpfile+".out"]); //the array is the arguments
                    console.log("input is : ");
                    if(compileGCC.status!=0){
                        //console.log(`compile error ${compileGCC.stderr.toString()}`);
                        res.send({status:400,stdout:`compile error ${compileGCC.stderr.toString()}`});
                        removeFile("./tmpfiles/" + tmpfile + ".cpp");
                    }
                    else{

                        const tc = problem.problemStatement.testCases;
                        let result=true;
                        console.log(tc);
                        for(let i=0;i<tc.length;i++){
                            //console.log(problem.problemStatement.sampletestcase.input);
                            const runGCC = cp.spawnSync("./tmpfiles/" + tmpfile + ".out", { 
                                input   : tc[i].input,
                                timeout : 2000
                            });
                            //console.log(runGCC.stdout.toString());
                            if (runGCC.signal == "SIGTERM"){
                                res.send({stdout:"Segmentation fault"});
                            }
                            else if (runGCC.signal == "SIGSEGV"){
                                res.send("Segmentation fault");
                            }
                            if(runGCC.stdout.toString().trim() != tc[i].output.trim()){
                                result=false;
                            }
                        }
                        /*
                        //testing purpose
                        //var ss = fs.writeFileSync("../mahendra.txt", runGCC.stdout.toString().replace(/[^\S\r\n]+$/gm, ""));
                        //var ss1 = fs.writeFileSync("../mahendra1.txt", problem.problemStatement.sampletestcase.output.replace(/[^\S\r\n]+$/gm, ""));
                        
                        */
                       
                        //result of submission 1 - passes , 0 - failed 
                        
                        //test for signals ie..for Timeout , Segmentation fault
                        
                        //match the actual output with user output
                        if (result){
                            res.status(200).send({stdout:"tests passed"});
                            result = 1;
                            updateResult(problem , result , req);
                        }
                        else{
                            res.send({stdout:"tests failed"});
                            result = 0;
                        }

                        //remove ".cpp" and ".out" generated files for C++
                        removeFile("./tmpfiles/" + tmpfile + ".cpp");
                        removeFile("./tmpfiles/" + tmpfile + ".out");
                    }
                }

            });
            
        }
    }); 
};


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
function updateResult(problem , result,req) {
    
    const resultOfSubmission = {
        user        : req.session.user.username,
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
                

