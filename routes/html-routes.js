// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const hoods = require("../utils/hoods")

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("signup", { neighborhoods: hoods });
  });

  app.get("/forum", (req, res) => {
    if (req.user) {
      db.Post.findAll({
        where: {
          neighborhood: req.user.neighborhood
        }
      }).then(neighborData => {

        res.render("forum",{
          city: req.user.neighborhood,
          home: req.user.neighborhood,
          post: neighborData
        } )
      })

    }
  })

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.render("members");
  });

  app.get("/posts", (req, res) => {
    res.render("forum");
  });
};