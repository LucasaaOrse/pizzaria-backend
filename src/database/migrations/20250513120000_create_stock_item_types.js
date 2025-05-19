exports.up = async function (knex) {
  // 1) cria tabela de tipos
  await knex.schema.createTable("stock_item_types", table => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
  });

  // 2) popula com os tipos atuais
  await knex("stock_item_types").insert([
    { name: "ingrediente" },
    { name: "bebida" },
    { name: "refrigerante" },
    { name: "outro" },
  ]);
};

exports.down = async function (knex) {
  await knex.schema.dropTable("stock_item_types");
};
