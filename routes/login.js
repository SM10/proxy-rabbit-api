const router = require('express').Router();
const controller = require('../controller/login-controller');
const knex = require("knex")(require("../knexfile"))
const jwt = require('jsonwebtoken')
const {google} = require("googleapis");
require('dotenv').config()
const {v4: uuidv4} = require('uuid')
const crypto = require('crypto');
const querystring = require('querystring')

router.route("/").post(controller.login)

const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);
const scope = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']

router.route("/google").get((req, res, next) => {
    const url = client.generateAuthUrl({
        access_type: "offline",
        scope: scope,
        include_granted_scopes: true
    })
    res.status(200).send(url);
})

router.route("/google/callback").get(async (req, res) =>{
    const {code} = req.query;
    try{
        const {tokens} = await client.getToken(code);
        client.setCredentials(tokens)
        const userProfile = google.oauth2("v2")
        userProfile.userinfo.get({
            auth: client,
        }, 
        async (error, response) =>{
            console.log(response.data);
            const email = response.data.email
            const userData = await knex("user").join("country", "user.country_id", "=", "country.id")
                        .select("user.id as user_id", "user.email as email", "user.first_name as first_name", "user.last_name as last_name", "user.country_id as country_id", "country.name as country_name")
                        .where("user.email", "=", email)
            if(userData.length > 0){
                let token = jwt.sign({user_id: userData[0].user_id}, process.env.SESSION_SECRET)
                res.status(200).redirect(`${process.env.PROXY_RABBIT_FRONTEND}/LoginSuccess?${querystring.stringify({...userData[0], token: token})}`)
            }else{
                const countries = await knex("country")
                let salt = crypto.randomBytes(16);
                crypto.pbkdf2(uuidv4(), salt, 31000, 32, "sha256", async function (err, hashedPassword){
                    if(err) return next(err);
                    try{
                        await knex("user").insert({
                            id: uuidv4(),
                            email: email,
                            first_name: response.data.given_name,
                            last_name: response.data.family_name,
                            hashed_password: hashedPassword,
                            country_id: countries[0].id,
                            salt: salt
                        });
                        const userData = await knex("user").join("country", "user.country_id", "=", "country.id")
                            .select("user.id as user_id", "user.email as email", "user.first_name as first_name", "user.last_name as last_name", "user.country_id as country_id", "country.name as country_name")
                            .where("user.email", "=", email)
                        let token = jwt.sign({user_id: userData[0].user_id}, process.env.SESSION_SECRET)
                        res.status(200).redirect(`${process.env.PROXY_RABBIT_FRONTEND}/LoginSuccess?${querystring.stringify({...userData[0], token: token, to_register: true})}`)
                    }catch(error){
                        console.log(error)
                        return res.status(400).redirect(`${process.env.PROXY_RABBIT_FRONTEND}/Error?message=User profile could not be created. Please ensure your google account has a first name, last name and email.`)
                    }
                })
            }
        })
    }catch(error){
        console.log(error)
        res.status(400).redirect(`${process.env.PROXY_RABBIT_FRONTEND}/Error?message=Login/registration failed for unknown reason.`)
    }
})

module.exports = router;