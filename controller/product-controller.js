const knex = require('knex')(require('../knexfile'))

const getProducts = async (_req, res)=>{
    try{
    const products = await knex("product");
    res.status(200).send(products)
    }catch(error){
        res.status(400).send(error)
    }
}

const searchProducts = async (req, res)=>{
    try{
        const products = await knex("product").whereILike("name", `${req.params.search}%`);
        res.status(200).send(products)
    }catch(error){
        res.status(400).send(error)
    }
}

const discoverProducts = async (req, res) =>{
    try{
        const products = await knex("product");
        if(products.length <= 9) res.status(200).send(products);
        else{
            let returnArray = [];
            let productArray = Object.assign([], products)
            while (returnArray.length < 9){
                returnArray.push(productArray.splice(0, Math.round((Math.random() * (productArray.length - 1)))))
            }
            res.status(200).send(products)
        }
    }catch(error){
        res.status(400).send(error)
    }
}

const popularProducts = async (req, res)=>{
    try{
        let products = await knex("product").orderBy("views", "desc");
        console.log(products);
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