require('dotenv').config();
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

async function testConnection() {
  try {
    // Testa conexão e traz a versão do banco
    const result = await knex.raw('SELECT version()');
    console.log("✅ Conectado com sucesso ao banco!");
    console.log(result.rows[0].version);
    await knex.destroy();
  } catch (err) {
    console.error("❌ Erro ao conectar no banco:", err);
  }
}

testConnection();
