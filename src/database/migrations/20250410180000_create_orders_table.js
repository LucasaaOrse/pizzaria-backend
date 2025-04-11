exports.up = function(knex) {
    return knex.schema.createTable("orders", function(table) {
        table.increments("id").primary(); // ID auto incrementado
        table.integer("table").notNullable(); // Número da mesa
        table.boolean("status").defaultTo(false); // Pedido feito ou não (default: false)
        table.boolean("draft").defaultTo(true); // Se está sendo montado (default: true)
        table.string("name"); // Nome opcional do pedido
        table.timestamps(true, true); // created_at e updated_at
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("orders");
};