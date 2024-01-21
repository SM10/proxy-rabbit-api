const knex = require('knex')(require('../knexfile'));
const {v4: uuidv4} = require('uuid')

function loadObject(object, key, value){
    if(!value || value === '') throw new Error(`Missing ${key}. Please ensure all fields are filled`)
    return {...object, [key]: value}
}

const registerUser = async (request, response)=>{
    
    const allUsers = await knex("user");
    const existingUser = allUsers.find(user=>{
        if(request.body && request.body.email && user.email === request.body.email) return user;
    })
    if(existingUser){
        response.status(409).send("User already exists")
    }
    try{
        let newUser = {};
        newUser = loadObject(newUser, "id", uuidv4())
        newUser = loadObject(newUser, "email", request.body.email);
        newUser = loadObject(newUser, "password", request.body.password);
        newUser = loadObject(newUser, "first_name", request.body.first_name);
        newUser = loadObject(newUser, "last_name", request.body.last_name);
        newUser = loadObject(newUser, "country_id", request.body.country_id);
        newUser = {...newUser, session_id: null}
        console.log(newUser);
        await knex("user").insert(newUser)
        response.send(200)
    }catch(error){
        response.status(409).send(error.message)
    }
}

module.exports = {registerUser}