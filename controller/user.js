const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};
//user signup  route
module.exports.userSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//user login
module.exports.login = async (req, res) => {
  console.log("User Logged In:", req.user),
    req.flash("success", "Welcome Back To Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//user logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged you out!");
    res.redirect("/listings"); // redirect to home page
  });
};
