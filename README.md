This project follows the MVC pattern. Controllers handle logic between routes and database models.
 -------------------- MODEL ---------------------------------
🔹 models/listing.js

Defines the Listing schema for holiday bookings.
	•	Fields:
	•	title (String, required) – Listing title
	•	description, price, location, country
	•	image (Cloudinary) – { url, filename }
	•	geometry (GeoJSON) – Used for Mapbox integration
	•	reviews – Linked review IDs (reference to Review)
	•	owner – Listing creator (reference to User)
	•	Post Middleware:
	•	Deletes associated reviews when a listing is deleted

 🔹 models/reviews.js

Defines the Review schema.
	•	Fields:
	•	comment, rating (1–5)
	•	createdAt – Defaults to current date
	•	author – Reference to the reviewing user

 🔹 models/user.js

Defines the User schema with authentication.
	•	Fields:
	•	email (String, required)
	•	Uses passport-local-mongoose to auto-manage username, hash, and salt
  -------------------- VIEW --------------------------------------
 🔹  index.js
	•	Purpose: Displays all listings in a card grid format.
	•	Features:
	•	Iterates over allListings and displays each one with:
	•	Image
	•	Title
	•	Price (formatted for Indian currency)
	•	Each listing links to its individual detail page (/listings/:id).

 🔹  new.js
	•	Purpose: Renders a form to create a new listing.
	•	Form Inputs:
	•	Title, Description
	•	Image upload (file input)
	•	Price, Country, Location
	•	Form Method: POST /listings
	•	Validation: Bootstrap-style validation with feedback.

 🔹  edit.js
	•	Purpose: Renders a pre-filled form to edit an existing listing.
	•	Form Inputs (pre-filled with listing data):
	•	Title, Description
	•	Optionally upload a new image
	•	Price, Country, Location
	•	Form Method: POST /listings/:id?_method=PUT (uses method override for PUT)

 🔹  show.js
	•	Purpose: Displays the detailed view of a single listing.
	•	Features:
	•	Listing image, title, description, owner, price, location, and country.
	•	Edit/Delete buttons (visible only if the logged-in user is the owner).
	•	A map view rendered with Mapbox using listing.geometry.coordinates.
	•	Review form:
	•	Rating (1 to 5 stars)
	•	Comment
	•	Displays all reviews below the form.
	•	Allows deletion of individual reviews.

 -------------------- CONTROLLER ---------------------------------
🔸 controllers/listing.js

Manages all listing-related functionality:
	•	index – Show all listings (/listings)
	•	renderNewForm – Show form to create a listing
	•	createListing – Add new listing with Mapbox geolocation & image upload
	•	showListings – Show details of a listing (with reviews & owner)
	•	renderEditForm – Show form to edit listing
	•	updatedListing – Update listing (with optional new image)
	•	destroyListing – Delete listing

🔸 controllers/review.js

Handles reviews for listings:
	•	createReview – Add a review to a listing
	•	destroyReview – Delete a review from a listing

 🔸 controllers/user.js

Handles user authentication:
	•	renderSignupForm – Show signup form
	•	userSignup – Register user and auto-login
	•	renderLoginForm – Show login form
	•	login – Log in existing user
	•	logout – Log out current user
