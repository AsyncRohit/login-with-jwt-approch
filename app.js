const express = require("express");
const app = express();
const path = require("path");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("register");
});

app.post("/create", function (req, res) {
  var { username, password, name } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let user = await userModel.create({
        username,
        name,
        password: hash,
      });
      let token = jwt.sign({ username, userif: user._id }, "chupbsdk");
      res.cookie("token", token);
      res.redirect("/");
    });
  });
});

app.post("/login", async (req, res) => {
  var { username, password } = req.body;
  let user = await userModel.findOne({ username });
  if (!user) res.send("soemthing wents wrong");
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ username, userif: user._id }, "chupbsdk");
      res.cookie("token", token);
      res.redirect("/fun");
    } else res.send("incorrect username or password");
  });
});
app.get("/fun", (req, res) => {
  res.render("profile");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("running");
});
