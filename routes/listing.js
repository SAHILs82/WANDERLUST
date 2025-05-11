const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route - Show all listings
// Create Route - Add new listing to the database
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("image"),
    wrapAsync(listingController.createListing)
  );

// New Route - Show form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, and Delete Route (Fixed Syntax)
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updatedListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route - Show form to edit existing listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
