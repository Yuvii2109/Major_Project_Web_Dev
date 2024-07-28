// models listing.js

const mongoose = require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    image: {
        url: String,
        filename: String
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    // Schema.Types.ObjectId -
    // It means that the reviews property is an array of review IDs.
    // The review IDs are stored in the reviews property, but the actual review documents are stored in
    // the Review collection in the database.
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{location:{type:String}}`
            enum: ["Point"], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
    else{
        console.log("No listing found to delete");
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;