/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const {v4: uuid} = require('uuid')
const crypto = require('crypto')

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
    const salt = crypto.randomBytes(16);
    return {
      id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        hashed_password: crypto.pbkdf2Sync(user.password, salt, 31000, 32, 'sha256'),
        salt: salt,
        country_id: countryData[user.country_id].id
    }
  }));
  const room_id1 = uuid()
  const room_id2 = uuid()
  const room_id3 = uuid()
  await knex("message_master").insert([{
    room_id: room_id1,
    user_one: userData[0].id,
    user_two: userData[1].id
  },{
    room_id: room_id2,
    user_one: userData[2].id,
    user_two: userData[1].id
  },{
    room_id: room_id3,
    user_one: userData[0].id,
    user_two: userData[2].id
  }])
  await knex("messages").insert([{
    room_id: room_id1,
    from: userData[1].id,
    to: userData[0].id,
    message: "This is a seeded message"
  },{
    room_id: room_id2,
    from: userData[2].id,
    to: userData[1].id,
    message: "This is a seeded message between index 1 and 2"
  },
    {
      room_id: room_id3,
      from: userData[0].id,
      to: userData[2].id,
      message: "This is a seeded message between index 0 and 2"
    }]
)
};