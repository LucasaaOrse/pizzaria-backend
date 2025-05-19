// migrations/20250516_create_stock_item_types.js
/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // 1) cria tabela de tipos
  await knex.schema.createTable("stock_item_types", table => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
  });

  // 2) popula com os tipos atuais do enum
  await knex("stock_item_types").insert([
    { name: "ingrediente" },
    { name: "bebida" },
    { name: "refrigerante" },
    { name: "outro" },
  ]);

  // 3) adiciona fk em stock_items
  await knex.schema.alterTable("stock_items", table => {
    table
    .integer("type_id")
    .unsigned()
    .notNullable()
    .defaultTo(1)
    .references("id")
    .inTable("stock_item_types")
    .onDelete("RESTRICT");
  });

  // 4) opcional: remover coluna enum 'type' depois de migrar dados
  await knex.schema.alterTable("stock_items", table => {
    table.dropColumn("type");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("stock_items", table => {
    table.string("type"); // recria como string simples
    table.dropForeign("type_id");
    table.dropColumn("type_id");
  });
  await knex.schema.dropTable("stock_item_types");
};
