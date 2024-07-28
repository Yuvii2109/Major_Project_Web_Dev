// controllers listingsController.js code 

const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    // In order to populate the reviews send along with the listings
    // we need to use the populate method on the listing model
    const listing = await 
    Listing.findById(id)
    .populate({path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "The listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next)=>{
    if(!req.body.listing){
        throw new expressError(400, "Send valid data for listing");
    };
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();
    console.log(response.body.features[0].geometry);

    // const {title, description, price, image, country, location} = req.body;
    // Yeh toh hogya ek treeka jb hmne listing ke saath key value pair na bna dia ho name main hmari ejs file ke elements ki 
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, " , ", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Automatically owner allot krne ke liye
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created!")
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "The listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_450");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res, next) => {
    try{
        if(!req.body.listing){
            throw new expressError("Send valid data for listing", 400);
        }
        let {id} = req.params;
        console.log(id);

        // Geocode the new location
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            })
            .send();
        const geometry = response.body.features[0].geometry;
        console.log(geometry);

        // Update the listing with new data
        let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing, geometry}, {new: true});

        if (req.file){
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = {url, filename};
        }

        await updatedListing.save();
        console.log(updatedListing);

        req.flash("success", "Changes Saved!");
        res.redirect(`/listings/${id}`);
    }catch (err){
        next(err);
    }
};

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!")
    res.redirect("/listings");
};