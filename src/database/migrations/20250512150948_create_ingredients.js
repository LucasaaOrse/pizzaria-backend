exports.up = function(knex) {
  return knex.schema.createTable('ingredients', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.decimal('quantity', 10, 2).notNullable(); // ex: 2.5
    table.string('unit').notNullable(); // ex: 'kg', 'g', 'L'
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ingredients');
};
