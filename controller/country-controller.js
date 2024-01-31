const knex = require("knex")(require('../knexfile'))

const getCountries = async (_request, response) =>{
    const countries = await knex("country")
    response.status(200).send(countries);
}

const getCountriesProducts = async (request, response) => {
    const products = await knex("product").join("country", "product.country_id", "=", "country.id")
        .select("product.id as product_id", "product.name as product_name", "product.image_url", "country.id as country_id", "country.name as country_name")
        .where("country_id", "=", request.params.countryId);
    response.status(200).send(products);
}

const getCountriesUsers = async (request,response)=>{
    const users = await knex("user").join("country", "user.country_id", "=", "country.id")
        .select("user.id as id", "user.first_name as first_name", "user.last_name as last_name", "country.id as country_id", "country.name as country_name")
        .where("country_id", "=", request.params.countryId);
    
    response.status(200).json(users);
}

const changeCountries = async (request, response)=>{
    //try{
        await knex("user").where("id", "=", request.body.id).update({country_id: request.body.country_id})
        const userData = await knex("user").join("country", "user.country_id", "=", "country.id")
                        .select("user.id as user_id", "user.email as email", "user.first_name as first_name", "user.last_name as last_name", "user.country_id as country_id", "country.name as country_name")
                        .where("user.id", "=", request.body.id);
        response.status(200).json(userData[0])
    //}catch(error){
    //    response.status(400).send(error.message)
    //}
}

module.exports = {getCountries, getCountriesProducts, getCountriesUsers, changeCountries}