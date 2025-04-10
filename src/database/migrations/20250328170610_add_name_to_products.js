exports.up = function(knex) {
    return knex.schema.alterTable("products", function(table) {
        table.string("name").notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable("products", function(table) {
        table.dropColumn("name");
    });
};
