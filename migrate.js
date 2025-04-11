const knex = require('./src/database');

async function resetAndMigrate() {
  try {
    console.log("🔁 Apagando todas as tabelas...");
    await knex.raw(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);
    console.log("✅ Tabelas apagadas com sucesso!");

    console.log("🚀 Rodando migrations...");
    await knex.migrate.latest();
    console.log("✅ Migrations concluídas!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao resetar e migrar:", err);
    process.exit(1);
  }
}

resetAndMigrate();
