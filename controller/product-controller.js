const knex = require('knex')(require('../knexfile'))

const getProducts = async (_req, res)=>{
    try{
    const products = await knex("product").join("country", "product.country_id", "=", "country.id")
        .select("product.id as id", "product.image_url as image_url", "product.name as name", "country.id as country_id", "country.name as country_name");
    res.status(200).send(products)
    }catch(error){
        res.status(400).send(error)
    }
    
}

const searchProducts = async (req, res)=>{
    try{
        const products = await knex("product").whereILike("product.name", `${req.params.search}%`).join("country", "product.country_id", "=", "country.id")
        .select("product.id as id", "product.image_url as image_url", "product.name as name", "country.id as country_id", "country.name as country_name");;
        res.status(200).send(products)
    }catch(error){
        res.status(400).send(error)
    }
    
}

const discoverProducts = async (req, res) =>{
    try{
        const products = await knex("product").join("country", "product.country_id", "=", "country.id")
        .select("product.id as id", "product.image_url as image_url", "product.name as name", "country.id as country_id", "country.name as country_name");
        if(products.length <= 9) res.status(200).send(products);
        else{
            let returnArray = [];
            let productArray = Object.assign([], products)
            while (returnArray.length < 9){
                let random = Math.round((Math.random() * (productArray.length - 1)));
                returnArray = returnArray.concat(productArray.splice(random,1))
            }
            res.status(200).send(returnArray)
        }
    }catch(error){
        res.status(400).send(error)
    }
    
}

const popularProducts = async (req, res)=>{
    try{
        let products = await knex("product").join("country", "product.country_id", "=", "country.id")
        .select("product.id as id", "product.image_url as image_url", "product.name as name", "country.id as country_id", "country.name as country_name").orderBy("product.views", "desc").limit(9)
        if(products.length <= 9) res.status(200).send(products);
        else{
            const returnArray = products.splice(0, 9);
            res.status(200).send(returnArray);
        }
    }catch(error){
        res.status(400).send(error)
    }
    
}

module.exports = {getProducts, searchProducts, discoverProducts, popularProducts}