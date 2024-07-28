// middleware.js code 

const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.originalUrl);
    console.log(req.user);
    // Dekho agr user logged in h toh phir toh koi prob hi ni 
    // But hme originalUrl tb chahiye hoga jb user logged out h 
    // Taaki hm user ko uske last path pr redirect kr ske
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to perform this function");
        return res.redirect("/login");
    };
    next();
};
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
};