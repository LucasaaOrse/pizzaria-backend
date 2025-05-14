/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.string('order_id').notNullable();
    table.enum('author', ['garcom', 'cozinha']).notNullable();
    table.text('message').notNullable();
    table.timestamp('timestamp').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
