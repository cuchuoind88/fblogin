const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const User = require("../models/user");
const authenticate = require("../models/authenticate");
const { corsWithOptions } = require("../models/cors");
userRouter.use(express.json());
userRouter.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstName) {
          user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
          user.lastName = req.body.lastName;
        }
        user
          .save()
          .then((user) => {
            /* passport.authenticate('local')*/
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          })
          .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          });
      }
    }
  );
});
userRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status = 400;
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    res.login(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!",
        });
      }
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    });
  })(req, res, next);
});
userRouter.get(
  "/facebook/token",
  passport.authenticate("facebook-token", { session: false }),
  (req, res) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
  }
);
userRouter.post("/checkJWTtoken", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      res.sendStatus(400);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
      s;
    }
  })(req, res);
});
module.exports = userRouter;
