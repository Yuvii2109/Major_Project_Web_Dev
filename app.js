// app.js code 

if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const path = require("path");
app.set("view engine", "ejs");

app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
// It is a package that allows us to use the ejs templating language in our views.

const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => console.log("Connected to the database"))
.catch(err => console.log(err));
async function main(){
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60 // Isme seconds consider krte hain not ms
})

store.on("error", () => {
    console.log("Error in session store ", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
// To check this , hm website pr jaayege and vhaan pr inspect krke applications main 
// jaakr cookies check krenge agr connect.sid krke dikhega toh sessions work kr rhe hain
// The session middleware is used to store the session data in the server.
app.use(flash());
// The flash middleware is used to store the flash messages in the session data.
// Routes ke aane se pehle flash aana chahiye hmare code main 

app.use(passport.initialize());
// The initialize middleware is used to initialize the passport session.
app.use(passport.session());
// The session middleware is used to store the session data in the server.
passport.use(new localStrategy(User.authenticate()));
// The authenticate middleware is used to authenticate the user.
// local strategy is a strategy that uses the username and password to authenticate the user.
passport.serializeUser(User.serializeUser());
// The serializeUser middleware is used to serialize the user data.
// Serializing means converting the data into a string or a buffer.
passport.deserializeUser(User.deserializeUser());
// The deserializeUser middleware is used to deserialize the user data.
// Deserializing means converting the string or buffer back into the original data.

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/users.js");

app.get("/", (req,res)=>{
    res.render("listings/home.ejs");
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

app.all("*", (req,res,next)=>{
    next(new expressError(404, "Page not found!"));
});
app.use((err, req, res, next)=>{
    let{statusCode = 500, message = "Something went Wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(3000, ()=>{
    console.log("Server is running on port " + port);
});