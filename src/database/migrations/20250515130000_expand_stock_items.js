exports.up = async function(knex) {
  await knex.schema.renameTable('ingredients', 'stock_items');

  await knex.schema.alterTable('stock_items', table => {
    table.integer('type_id')
      .unsigned()
      .notNullable()
      .defaultTo(1)
      .references('id')
      .inTable('stock_item_types')
      .onDelete('RESTRICT');

    table.decimal('price', 10, 2).nullable();
    table.string('unit').nullable().alter();
    table.integer('minimum_quantity').notNullable().defaultTo(1);
  });

  // Atualiza a FK na tabela recipes
  await knex.schema.alterTable('recipes', table => {
    table.dropForeign('ingredient_id');
    table.foreign('ingredient_id')
      .references('id')
      .inTable('stock_items')
      .onDelete('CASCADE');
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('recipes', table => {
    table.dropForeign('ingredient_id');
    table.foreign('ingredient_id')
      .references('id')
      .inTable('ingredients')
      .onDelete('CASCADE');
  });

  await knex.schema.alterTable('stock_items', table => {
    table.dropColumn('type_id');
    table.dropColumn('price');
    table.string('unit').notNullable().alter();
    table.dropColumn('minimum_quantity');
  });

  await knex.schema.renameTable('stock_items', 'ingredients');
};
