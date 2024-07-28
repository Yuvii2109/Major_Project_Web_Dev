// routes users.js code

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usersController = require("../controllers/usersController.js");

router
    .route("/signup")
        .get(usersController.signup)
        .post(wrapAsync(usersController.register));

router
    .route("/login")  
        .get(usersController.signin)
        .post(saveRedirectUrl,
        passport.authenticate("local", 
            {failureFlash: true, 
            failureRedirect: "/login"
        }), usersController.login);

router.get("/logout", usersController.logout);

module.exports = router;