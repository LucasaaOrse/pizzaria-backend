exports.up = function(knex) {
    return knex.schema.createTable("items", (table) => {
        table.increments("id").primary();
        table.integer("amount").notNullable();
        
        // Chave estrangeira para a tabela orders
        table.integer("order_id").unsigned().notNullable();
        table.foreign("order_id").references("orders.id").onDelete("CASCADE");
        
        // Chave estrangeira para a tabela products
        table.integer("product_id").unsigned().notNullable();
        table.foreign("product_id").references("products.id").onDelete("CASCADE");
        
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("items");
};
