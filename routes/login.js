const router = require('express').Router();
const controller = require('../controller/login-controller');
const passport = require('passport');
const morgan = require('morgan');
require('dotenv').config()

router.route("/").post(controller.login)
router.route("/google").post((req, res, next) => {
    const country = req.body.country_id
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?state=${country}redirect_uri=${process.env.GOOGLE_CALLBACK_URL}/redirect&prompt=consent&response_type=token&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=address https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline&service=lso&o2v=2&theme=glif&flowName=GeneralOAuthFlow`)
})

module.exports = router;