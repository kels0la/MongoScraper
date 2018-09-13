let db = require("../models");
let axios = require('axios'); // HTTP Request
let cheerio = require('cheerio'); // Web Scrapper
let mongoose = require('mongoose'); // MongoDB ORM

mongoose.connect("mongodb://localhost/scrapingMongos");

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        axios.get("http://www.yours.org/").then((response) => {

            const $ = cheerio.load(response.data);

            $(".post-information").each((i, element) => {
                const result = {};

                result.title = $(element).children(".post-link").text();
                result.link = $(element).children(".post-link").children("h3").children("a").attr("href");
                result.amount = $(element).children(".content-underline").children(".post-details")
                    .children(".vote-button").children(".amount").text();
                result.author = $(element).children(".small-text").children(".user-earnings").children(".user-tooltip-container").children(".tooltip").children(".author-name").text()

                db.Article.create(result)
                    .then((dbArticle) => {
                        console.log(dbArticle);
                    }).catch((error) => {
                        return res.json(error);
                    });
            });
            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        //This is where I only include the unsaved
        db.Article.find({ saved: false })
            .then(function (articles) {
                // If all articles are successfully found, send them back to the client
                res.json(articles);
            })
            .catch(function (err) {
                // If an error occurs, send the error back to the client
                res.json(err);
            });
    });

    app.get("/savedarticles/:id", (req, res) => {
        db.Article.find({ _id: req.params.id }).populate("note")//If this doesn't work user findByID(req.params.id).populate
            .then((article) => {
                res.json(article);
            }).catch(function (err) {
                res.json(err);
            });
    });
    // Mark an Article as saved
    app.get("/marksaved/:id", (req, res) => {
        db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: true } }, { new: true }, (err, edited) => {
            if (err) { res.send(error); console.log(error); }
            console.log(edited);
            res.send(edited);
        });
    });

    app.get("/savedarticles", function (req, res) {
        // Go into the mongo collection, and find all docs where "saved" is true
        db.Article.find({ saved: true }, (error, found) => {
            // Show any errors
            if (error) {
                console.log(error);
            }
            else {
                // Otherwise, send the articles we found to the browser as a json
                res.json(found);
            }
        });
    });

    app.put("/delete/:id", (req, res) => {
        db.Article.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                res.json(err);
            } else {
                res.send("Removed");
            }
        });
    });
    // Route for saving/updating an Article's associated Note
    app.post("/savedarticles/:id", (req, res) => {
        // save the new note that gets posted to the Notes collection
        // then find an article from the req.params.id
        // and update it's "note" property with the _id of the new note
        db.Note.create(req.body)
            .then( (dbNote) => {
                console.log(dbNote)
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then( (dbArticle) => {
                // If the User was updated successfully, send it back to the client
                res.json(dbArticle);
                console.log(dbArticle)
            })
            .catch( (err) => {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    });
};