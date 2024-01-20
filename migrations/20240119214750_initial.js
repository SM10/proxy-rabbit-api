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
        table.integer("country_id").unsigned().references("country.id").onUpdate("CASCADE").onDelete("CASCADE");
    }
  ).createTable(
    "user", (table)=>{
        table.uuid("id").unique().primary();
        table.string("email").unique().notNullable();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("password").notNullable();
        table.integer("country_id").unsigned().references("country.id").onUpdate("CASCADE").onDelete("CASCADE");
        table.uuid("session_id").unique();
        table.timestamp("session_last_act").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    }
  ).createTable(
    "message_master", (table)=>{
        table.increments("id").unique().primary();
        table.uuid("table_name").unique().notNullable();
        table.uuid("user_one").references("user.id");
        table.uuid("user_two").references("user.id");
    }
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
    let schema = knex.schema;

    const messageMasters = knex("message_master");
    if(messageMasters && messageMasters.length > 0){
        messageMasters.forEach(row => {
            schema.dropTableIfExists(row.table_name)
        })
    }

  return schema
    .dropTableIfExists("message_master")
    .dropTableIfExists("user")
    .dropTableIfExists("product")
    .dropTableIfExists("country")
};
