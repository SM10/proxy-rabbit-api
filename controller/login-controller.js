const knex = require('knex')(require('../knexfile'))
const {v4: uuidv4} = require('uuid')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');

const login = async (request, response, next) => {
    
    passport.authenticate("local", function(err, user,info,status){
        if (err) {return next(err)}
        if(!user) {return response.status(409).send("User not found")}
        request.logIn(user, function(err){
            if (err) {return next(err)}
            return response.status(200).send(`Login successful.`)
        })
    })(request, response, next)
}

module.exports = {login}