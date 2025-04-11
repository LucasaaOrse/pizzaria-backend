// migrate.js
const knex = require('knex');
const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

db.migrate.latest()
  .then(() => {
    console.log('✅ Migrations executadas com sucesso!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro ao rodar migrations:', err);
    process.exit(1);
  });
