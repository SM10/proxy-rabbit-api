/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const {v4: uuid} = require('uuid')

let countryData = require('../seed-data/country')
const productData = require('../seed-data/product')
const userData = require('../seed-data/user')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("messages").del()
  await knex("message_master").del();
  await knex("user").del()
  await knex('product').del()
  await knex("country").del()
  await knex('country').insert(countryData);
  countryData = await knex("country").select("*")
  await knex("product").insert(productData.map(product => {
    return {
      name : product.name,
      image_url: product.image_url,
      country_id: countryData[product.country_id].id
    }
  }));
  await knex("user").insert(userData.map(user => {
    return {
      id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password,
        country_id: countryData[user.country_id].id,
        session_id: user.session_id
    }
  }));
  const room_id = uuid()
  await knex("message_master").insert({
    room_id: room_id,
    user_one: userData[0].id,
    user_two: userData[1].id
  })
  await knex("messages").insert({
    room_id: room_id,
    from: userData[1].id,
    to: userData[0].id,
    message: "This is a seeded message"
  })
};