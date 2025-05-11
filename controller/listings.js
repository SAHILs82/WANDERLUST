const Listing = require("../models/listing.js");

// Index Route - Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

// New router - Show form to create new listing
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

// Show router - Show details of a specific listing
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  res.render("./listings/show.ejs", { listing });
};

// Create router - Add new listing to the database
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let { title, description, price, location, country } = req.body;
  let details = new Listing({
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
  });
  details.owner = req.user._id;
  details.image = { url, filename };
  await details.save();
  req.flash("success", "New listing Created!");
  // res.redirect("/listings");
  res.redirect(`/listings/${details._id}`);
};

// Edit router - Show form to edit existing listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exists");
    res.redirect("/lisitngs");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl }); // Corrected from edit.js to edit.ejs
};

//Update router
module.exports.updatedListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;
  const updatedListing = {
    title,
    description,
    price,
    location,
    country,
  };
  let lisitng = await Listing.findByIdAndUpdate(id, updatedListing);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    lisitng.image = { url, filename };
    await lisitng.save(); // Save the updated listing
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

//Delete router
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
};
