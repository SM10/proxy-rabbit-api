const knex = require('knex')(require('../knexfile'))
const {v4: uuidv4} = require('uuid')

const login = async (request, response) => {
    const users = await knex("user").join("country", "user.country_id", "=", "country.id")
        .select("user.id", "user.email", "user.password", "user.first_name", "user.last_name", "country.name", "user.session_id", "user.session_last_act");
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
}

module.exports = {login}