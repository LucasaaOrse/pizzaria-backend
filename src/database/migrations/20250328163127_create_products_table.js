exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
        table.increments('id').primary();
        table.string('description').notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.string('banner').notNullable(); // URL da imagem
        table.integer('category_id').unsigned().notNullable();
        
        // Criando o relacionamento (chave estrangeira)
        table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE');

        table.timestamps(true, true); // created_at e updated_at
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('products');
};
