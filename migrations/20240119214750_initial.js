/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable(
    'country', (table)=>{
        table.increments("id").primary();
        table.string("name").notNullable();
    }
  ).createTable(
    "product", (table)=>{
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("image_url");
        table.integer("country_id").unsigned().notNullable().references("country.id").onUpdate("CASCADE").onDelete("CASCADE");
    }
  ).createTable(
    "user", (table)=>{
        table.uuid("id").unique().primary();
        table.string("email").unique().notNullable();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("password").notNullable();
        table.integer("country_id").unsigned().notNullable().references("country.id").onUpdate("CASCADE").onDelete("CASCADE");
        table.uuid("session_id").unique();
        table.timestamp("session_last_act").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    }
  ).createTable(
    "message_master", (table)=>{
        table.increments("id").unique().primary();
        table.uuid("room_id").unique().notNullable();
        table.uuid("user_one").references("user.id");
        table.uuid("user_two").references("user.id");
    }
  ).createTable(
    "messages", (table)=>{
        table.increments("id").unique().primary();
        table.uuid("room_id").references("message_master.room_id");
        table.uuid("from").references("user.id");
        table.uuid("to").references("user.id");
        table.string("message").notNullable();
        table.timestamp("timestamp").defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    }
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
    let schema = knex.schema;

  return schema
    .dropTableIfExists("messages")
    .dropTableIfExists("message_master")
    .dropTableIfExists("user")
    .dropTableIfExists("product")
    .dropTableIfExists("country")
};
