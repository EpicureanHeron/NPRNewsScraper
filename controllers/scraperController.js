var request = require("request")
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var db = require("../models");


module.exports = function (app) {

  app.get("/", function (req, res) {
    db.Article_NPR.find({}).lean().sort({ date: -1 })
      .then(function (dbArticles) {
        console.log(dbArticles)
        console.log("THIS IS IT JOE")

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
        db.Article_NPR.findOne({ titleInfo: newArticle.titleInfo })
          .then(function (articleResults) {
            //if no results are found add the article
            if (!articleResults) {

              db.Article_NPR.create(newArticle)
                .then(function (Article_NPR) {
                  // View the added result in the console
                  console.log(Article_NPR);
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

    db.Article_NPR.find({}).sort({ date: -1 })

      .then(function (articles) {
        res.json(articles)
      })
      .catch(function (err) {
        return res.json(err);
      })
  });

  app.get("/notes", function (req, res) {

    db.Note.find({}).sort({ date: -1 })

      .then(function (articles) {
        res.json(articles)
      })
      .catch(function (err) {
        return res.json(err);
      })
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/:id", function (req, res) {

    var articleID = req.params.id
    db.Article_NPR.findOne({ "_id": articleID }).lean()

      // .populate("note")
      .populate({ path: 'note', options: { sort: { 'date': -1 } } })


      .then(function (articleDBwithNotes) {
        // console.log(articleDB.note)
        // var hbsObject = {
        //   notes: articleDB.note
        // }
        var hbsObject = {
          articleAndNotes: articleDBwithNotes
        }

        res.render("comments", hbsObject);
      })
      .catch(function (err) {
        return res.json(err);
      })

  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {

    var notes = req.body
    db.Note.create(notes)

      .then(function (noteInfo) {
        return db.Article_NPR.findOneAndUpdate({ _id: req.params.id }, { $push: { note: noteInfo._id } });

      })
      // add this .then to force a response back to the ajax call so the page would reload after the article is created
      .then(function (responseNewNote) {
        res.json(responseNewNote)

      })

      .catch(function (err) {
        return res.json(err);
      })


  });

  app.delete("/note/:articleID/:noteID", function (req, res) {
    var articleID = req.params.articleID

    var noteID = req.params.noteID

    db.Article_NPR.update({ _id: articleID }, { $pull: { note: noteID } })

      .then(function (responseNotes) {

        db.Note.remove({ "_id": noteID })

          .then(function (response) {
            res.json(response)
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