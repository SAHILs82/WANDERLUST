const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./views/schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Fixed `req.locals` to `res.locals`
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params; // id is the id of the listing
  let listing = await Listing.findById(id);

  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params; // id is the id of the listing
  let review = await Review.findById(reviewId);

  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of the review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
