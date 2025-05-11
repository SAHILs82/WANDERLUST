const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// const listing = require("../routes/listing");
// const review = require("../routes/review");
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getcookies", (req, res) => {
//   res.cookie("great ", "namaste");
//   res.cookie("madeIn", "India");
//   res.send("sent you some cookies!");
// });

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("color", "red", { signed: true });
//   res.send("done!");
// });

// app.get("/verify", (req, res) => {
//   res.send(req.signedCookies);
// });

// app.get("/greet", (req, res) => {
//   let { name = "anonymous" } = req.cookies;
//   res.send(`Hi i am ${name}`);
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("Hi,I am root!");
// });

// app.use("/listings", listing);
// app.use("/reviews", review);

//express-sessions

const sessionOption = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOption));

app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not registered!");
  } else {
    req.flash("success", "user registered successfully!");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
