const knex = require('knex')(require('../knexfile'))
require('dotenv').config();
const crypto = require('crypto');
const jwt = require("jsonwebtoken")


const login = async (request, response, next) => {

    (async () => { //takes error, user, error in callback
        try{
            const users = await knex("user")
                .where("email", "=", request.body.email);
            if(!users || users.length === 0){
                response.status(404).send("Wrong email or password")
            }else{
            let user = users[0]
            crypto.pbkdf2(request.body.password, user.salt, 31000, 32, "sha256", async function(error, hashedPassword){
                if(error) return callback(error);
                if(!crypto.timingSafeEqual(user.hashed_password, hashedPassword)){
                    response.status(404).send("Incorrect username or password.")
                }
                const userData = await knex("user").join("country", "user.country_id", "=", "country.id")
                        .select("user.id as user_id", "user.email as email", "user.first_name as first_name", "user.last_name as last_name", "user.country_id as country_id", "country.name as country_name")
                        .where("user.email", "=", user.email)
                let token = jwt.sign({user_id: userData[0].user_id}, process.env.SESSION_SECRET)
                response.status(200).json({...userData[0], token: token})
            })
        }
        }catch(error){
            response.status(400).send("Something went wrong while logging in")
        }
    })();
}

module.exports = {login}