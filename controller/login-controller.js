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

/*app.get('/protected', function(req, res, next) {
    passport.authenticate('local', function(err, user, info, status) {
      if (err) { return next(err) }
      if (!user) { return res.redirect('/signin') }
      res.redirect('/account');
    })(req, res, next);
  });*/

/*async (request, response) => {
    
    console.log(users);
    const user = users.find((user) => {
        if (user.email === request.params.email){
            return user;
        }
    })
    if (!user){
        response.status(400).send("Email not found")
        return;
    }
    if (user.password !== request.params.password){
        response.status(400).send("Password is incorrect")
        return;
    }

    user.session_id = uuidv4();
    user.session_last_act = knex.raw("NOW()");
    console.log(user);
    await knex("user")
        .where("id", "=", user.id)
        .update({session_id: user.session_id, session_last_act: user.session_last_act})
    
    response.status(200).json({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        country: user.name,
        user_id: user.id,
        session_id: user.session_id,
    })
}*/

module.exports = {login}