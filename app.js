var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
const dishRouter = require("./routes/dishRouter");
const session = require("express-session");
const userRouter = require("./routes/userRouter");
const config = require("./cofig");
const passport = require("passport");
const authenticate = require("./models/authenticate");
var app = express();
const testModel = require("../ExpressServer/models/test");
const connect = mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
});
connect.then((db) => {
  console.log("Connected correctly to server");
});
const test1 = new testModel({ name: "The Anh" });
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/home", (req, res) => {
  res.send("This is my first express server");
});

app.use("/dishes", dishRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
