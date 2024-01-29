const knex = require('knex')(require('../knexfile'))
const {v4: uuidv4} = require('uuid')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

const login = async (request, response, next) => {
    
    passport.authenticate("local", function(err, user,info,status){
        if (err) {return next(err)}
        if(!user) {return response.status(409).send("User not found")}
        (
            async()=>{
                request.logIn(user, async function(err){
                    if (err) {return next(err)}
                    const userData = await knex("user").join("country", "user.country_id", "=", "country.id")
                        .select("user.id as user_id", "user.email as email", "user.first_name as first_name", "user.last_name as last_name", "user.country_id as country_id", "country.name as country_name")
                        .where("user.email", "=", user.email)
                    return response.status(200).json(userData[0])
                })
            }
        )()
        
    })(request, response, next)
}

module.exports = {login}