exports.up = function(knex) {
  return knex.schema.createTable('recipes', function(table) {
    table.increments('id').primary();

    table.integer('product_id').unsigned().notNullable();
    table.integer('ingredient_id').unsigned().notNullable();
    table.decimal('quantity', 10, 2).notNullable(); // quantidade necessária desse ingrediente

    // Foreign keys
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.foreign('ingredient_id').references('id').inTable('ingredients').onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recipes');
};
