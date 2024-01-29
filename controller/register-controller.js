const knex = require('knex')(require('../knexfile'));
const {v4: uuidv4} = require('uuid')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

const registerUser = (request, response)=>{
    let salt = crypto.randomBytes(16);
    crypto.pbkdf2(request.body.password, salt, 31000, 32, "sha256", async function (err, hashedPassword){
        if(err) return next(err);
        try{
        await knex("user").insert({
            id: uuidv4(),
            email: request.body.email,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            hashed_password: hashedPassword,
            country_id: request.body.country_id,
            salt: salt
        })
        }catch(error){
            return response.status(400).send(`Failed to register user. ${error.message}`)
        }
        response.status(201).send("Registration successful")
    })
}
module.exports = {registerUser}