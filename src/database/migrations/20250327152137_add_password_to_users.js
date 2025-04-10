exports.up = function (knex) {
    return knex.schema.table("users", function (table) {
      table.string("password").notNullable(); // Adiciona o campo de senha
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("users", function (table) {
      table.dropColumn("password"); // Remove o campo caso seja necessário reverter
    });
  };
  