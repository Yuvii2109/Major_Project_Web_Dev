// routes reviews.js code 

const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const expressError = require("../utils/expressError.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(", ");
        console.log(error);
        throw new expressError(400, msg);
    }else{
        next();
    }
};

const reviewsController = require("../controllers/reviewsController.js");

// Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.postReview));
// 1. We are getting the id of the listing from the URL using the req.params object
// 2. We are finding the listing in the database using the findById() method
// 3. We are creating a new Review object using the newReview variable
// 4. We are pushing the new Review object to the reviews array of the listing object
// 5. We are saving the listing object to the database using the save() method
// 6. We are saving the new Review object to the database using the save() method
// 7. We are redirecting the user to the listing page using the redirect() method

// Delete Review Route
router.delete("/:reviewId", isLoggedIn,
    isReviewAuthor, wrapAsync(reviewsController.deleteReview)
);

module.exports = router;