var request = require("request")
var cheerio = require("cheerio");

var db = require("../models");

module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Article.find({})
            .then(function (dbArticles) {
                console.log(dbArticles)

                var hbsObject = {
                    articles: dbArticles
                }

                res.render("index", hbsObject);


            })
    })


    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        request("https://www.npr.org/sections/news/", function (error, response, html) {

            // Load the HTML into cheerio
            var $ = cheerio.load(html);

            $(".item-info").each(function (i, element) {
                //article title
                var title = $(element).find("h2").text()
                //link
                var link = $(element).find("h2").find("a").attr("href")
                //short summary
                var teaser = $(element).find(".teaser").text()
                //object created to be placed in database
                var newArticle = {
                    titleInfo: title,
                    linkInfo: link,
                    teaserInfo: teaser
                }
                //checks if the article's title is already in the database
                db.Article.findOne({ titleInfo: newArticle.titleInfo })
                    .then(function (articleResults) {
                        //if no results are found add the article
                        if (!articleResults) {

                            db.Article.create(newArticle)
                                .then(function (dbArticle) {
                                    // View the added result in the console
                                    console.log(dbArticle);
                                })
                                .catch(function (err) {
                                    // If an error occurred, send it to the client  
                                    return res.json(err)
                                });
                        }
                    })
                    .catch(function (err) {
                        return res.json(err);
                    })
            });
            // If we were able to successfully scrape and save articles, redirect to the root which should cause the data to load on screen.
            res.redirect('/');

        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // TODO: Finish the route so it grabs all of the articles
        db.Article.find({})

            .then(function (articles) {
                res.json(articles)
            })
            .catch(function (err) {
                return res.json(err);
            })
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // TODO
        // ====
        // Finish the route so it finds one article using the req.params.id,
        // and run the populate method with "note",
        // then responds with the article with the note included
        db.Article.findOne({ "_id": req.params.id })

            .populate("note")

            .then(function (articleDB) {
                // console.log(articleDB.note)
                // var hbsObject = {
                //   notes: articleDB.note
                // }
                console.log(articleDB)
                // res.render("index", hbsObject);
                res.json(articleDB)
            })
            .catch(function (err) {
                return res.json(err);
            })

    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // TODO
        // ====
        // save the new note that gets posted to the Notes collection
        // then find an article from the req.params.id
        // and update it's "note" property with the _id of the new note
        var notes = req.body
        db.Note.create(notes)

            .then(function (noteInfo) {

                //this is from the solution. It doesn't use $set and is using a different method (update vs findOneAndUpdate)
                // return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: noteInfo._id }, { new: true });
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: noteInfo._id } });


            })

            .catch(function (err) {
                return res.json(err);
            })
        //res.json??

    });

    app.delete("/note/:articleID/:noteID", function (req, res) {
        var articleID = req.params.articleID

        var noteID = req.params.noteID

        db.Article.update({ _id: articleID }, { $pull: { note: noteID } })

            .then(function (responseNotes) {

                db.Note.remove({ "_id": noteID })

                    .then(function (response) {
                        console.log(response)
                    })
                    .catch(function (err) {
                        return res.json(err)
                    })
                    
            })

            .catch(function (err) {
                return res.json(err)
            })







    })

}