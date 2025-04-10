require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // necessário para o Neon
      }
    },
    migrations: {
      directory: "./src/database/migrations"
    }
  }
}
