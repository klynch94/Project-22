// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const hoods = require("../utils/hoods")

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the forum page
    if (req.user) {
      res.redirect("/forum");
    }
    res.render("signup", { neighborhoods: hoods });
  });

  app.get("/forum/:neighborhood?", (req, res) => {
    let searchedHood;
    if(req.params.neighborhood) {
      searchedHood = req.params.neighborhood;
    } else if(req.user) {
      searchedHood = req.user.neighborhood;
    }
    console.log(searchedHood);
    if (req.user) {
      db.Post.findAll({
        where: {
          neighborhood: searchedHood
        }
      }).then(function(results) {
        res.render("forum", {user: req.user, posts: results, current: searchedHood});
      });

    }
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the forum page
    if (req.user) {
      res.redirect("/forum");
      console.log(req.user)
    }
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/forum", isAuthenticated, (req, res) => {
    console.log(req.user)
    res.render("forum", {user:req.user});
  });

  app.get("/map", (req, res) => {
    res.render("chicago", {user: req.user});
  });
};
