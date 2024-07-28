// init index.js code 

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Why did we enter .. in the above line of code - 
// Because we are in the server folder and we want to access the models folder which is in the
// root folder of the project. So we have to go up one level and then go to the
// models folder. So we use .. to go up one level and then go to the models folder
// and then access the Listing.js file.

main()
.then(() => console.log("Connected to the database"))
.catch(err => console.log(err));
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "66a3d3d3965d74f31e7e80c9"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
};
initDB();