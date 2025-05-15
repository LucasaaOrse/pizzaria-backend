// migrations/20250515_expand_stock_items.js

exports.up = async function(knex) {
  // 1) renomeia ingredients → stock_items
  await knex.schema.renameTable('ingredients', 'stock_items');

  // 2) adiciona coluna type, price, torna unit nullable
  await knex.schema.alterTable('stock_items', table => {
    table
      .enu('type',
        ['ingrediente','bebida','refrigerante','outro'],
        { useNative: true, enumName: 'stock_item_type' }
      )
      .notNullable()
      .defaultTo('ingrediente');       // preenche linhas antigas

    table.decimal('price', 10, 2).nullable();
    table.string('unit').nullable().alter();
  });

  // 3) corrige FK em recipes que antes apontava ingredients.id
  await knex.schema.alterTable('recipes', table => {
    table.dropForeign('ingredient_id');
    table
      .foreign('ingredient_id')
      .references('id')
      .inTable('stock_items')
      .onDelete('CASCADE');
  });
};

exports.down = async function(knex) {
  // desfaz a FK em recipes
  await knex.schema.alterTable('recipes', table => {
    table.dropForeign('ingredient_id');
    table
      .foreign('ingredient_id')
      .references('id')
      .inTable('ingredients')
      .onDelete('CASCADE');
  });

  // remove colunas adicionadas
  await knex.schema.alterTable('stock_items', table => {
    table.dropColumn('type');
    table.dropColumn('price');
    table.alterColumn('unit', col => col.string().notNullable());
  });

  // renomeia de volta
  await knex.schema.renameTable('stock_items', 'ingredients');

  // opcional: remove enum do Postgres
  await knex.raw('DROP TYPE IF EXISTS stock_item_type');
};
