// controllers usersController.js code

const User = require("../models/user.js");

module.exports.signup = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.register = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // In order to Login automatically after SignUp
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Account Created!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.signin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success", "Welcome to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // Uprlikhit cheez hmne isliye ki kyuki jb hm seedhe login kr rhe hain
    // to redirectUrl ko undefined mil jata hai jiski vjh se vo listings pr redirect nahi hota
    // aur error de deta hai toh basically uss error ko tackle krne ke liye
    // hmne kuch thos kadam uthaye jo ki upr hai...
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        };
    req.flash("success", "Goodbye!");
    res.redirect("/listings");  
    });
};