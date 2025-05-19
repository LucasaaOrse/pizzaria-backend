/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // Deleta todos os tipos antigos (se apropriado)
  await knex("stock_item_types").del();

  // Insere os novos tipos
  await knex("stock_item_types").insert([
    { name: "ingrediente" },
    { name: "bebida alcoólica" },
    { name: "refrigerante" },
    { name: "suco" },
    { name: "água" },
    { name: "material de limpeza" },
    { name: "embalagem" },
    { name: "outro" },
  ]);
};

exports.down = async function (knex) {
  // Volta pros antigos, se quiser
  await knex("stock_item_types").del();
  await knex("stock_item_types").insert([
    { name: "ingrediente" },
    { name: "bebida" },
    { name: "refrigerante" },
    { name: "outro" },
  ]);
};
