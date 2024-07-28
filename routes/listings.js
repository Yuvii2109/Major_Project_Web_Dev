// routes listings.js code 

const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js"); 
const upload = multer({ storage });
const methodOverride = require("method-override");

const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(", ");
        console.log(error);
        throw new expressError(400, msg);
    }else{
        next();
    }
}; 

const listingsController = require("../controllers/listingsController.js");

router
    .route("/")
        // Index Route
        .get(wrapAsync(listingsController.index))
        // Create Route
        .post(isLoggedIn,
        upload.single("listing[image]"), 
        validateListing,
        wrapAsync(listingsController.createListing));
        // 1. We are creating a new Listing object using the newListing variable.
        // 2. We are saving the new Listing object to the database using the save() method.
        // 3. We are redirecting the user to the /listings route using the res.redirect
        // method. This will display all the listings in the database.
        // 4. We are using the req.body.listing object to access the data from the form

// New Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// New route ko show route se upr rakha hai taaki
// computer new ko id se confuse na krde...

router  
    .route("/:id")
        // Show Route
        .get(wrapAsync(listingsController.showListings))
        // Update Route
        .put(isLoggedIn, isOwner,
            upload.single("listing[image]"),
            validateListing, 
            wrapAsync(listingsController.updateListing)
        )
        // Delete Route
        .delete(isLoggedIn,
            isOwner, wrapAsync(listingsController.deleteListing)
        );

// Edit Route
router.get("/:id/edit", isLoggedIn,
    isOwner, wrapAsync(listingsController.renderEditForm));
// 1. We are getting the id of the listing from the URL using the req.params object
// 2. We are finding the listing in the database using the findById() method
// 3. We are rendering the edit.ejs file with the listing object
// 4. We are passing the listing object to the edit.ejs file so that we can
// display the listing details in the form

module.exports = router;