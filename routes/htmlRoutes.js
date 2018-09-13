// var db = require("../models"); May need this if I need the model

module.exports = function(app) {
    app.get("/", function (req, res) {
        res.render("index")
    })
    app.get("/saved", function (req, res) {
        res.render("saved");
    });
    app.get("*", function (req, res) {
        res.render("404");
    });
};