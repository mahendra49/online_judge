const express                       =   require("express")
,     router                        =   express.Router({mergeParams:true})
,     Editorial                     =   require("../models/editorial");



//index route
router.get("/", function(req, res) {

    Editorial.find({}, function(err, blogs) {
        if (err) {
            res.send('error');
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});

// new route
router.get("/new", function(req, res) {
    res.render("new");
});

// create route
router.post("/", function(req, res) {

    //create and redirect
    Editorial.create(req.body.blog, function(err, newblog) {
        if (err) {
            console.log("error in posting");
        }
        else {
            res.redirect("/editorials");
        }
    });
});

//show route
router.get("/:id", function(req, res) {

    Editorial.findById(req.params.id, function(err, foundblog) {
        if (err) {
            res.redirect("/editorials");
        }
        else {
            res.render("show", { blog: foundblog });
        }
    });
});

module.exports = router;