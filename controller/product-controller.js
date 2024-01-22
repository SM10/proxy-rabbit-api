const knex = require('knex')(require('../knexfile'))

const getProducts = async (_req, res)=>{
    try{
    const products = await knex("product");
    res.status(200).send(products)
    }catch(error){
        res.status(400).send(error)
    }
}

module.exports = {getProducts}