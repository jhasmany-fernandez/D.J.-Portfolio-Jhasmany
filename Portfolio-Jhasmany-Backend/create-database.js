const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Conectar a la base de datos 'postgres' por defecto
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '2307',
    database: 'postgres', // Conectar a la BD por defecto
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si la base de datos existe
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME || 'portfolio_db'}'`
    );

    if (result.rows.length === 0) {
      // Crear la base de datos
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'portfolio_db'}`);
      console.log(`✅ Base de datos '${process.env.DB_NAME || 'portfolio_db'}' creada exitosamente`);
    } else {
      console.log(`ℹ️  La base de datos '${process.env.DB_NAME || 'portfolio_db'}' ya existe`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
