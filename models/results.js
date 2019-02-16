const mongoose = require("mongoose");

//This Schema will store the result of a submission
/* 
    user        - name of user who submitted the problem
    problemId   - problemId of the problem --> from problem.js Schema
    result      - result of the submission 

*/


const resultsSchema = new mongoose.Schema({

    user        : String,
    problemId   : String,
    result      : Number

});

module.exports = mongoose.model("Result", resultsSchema);