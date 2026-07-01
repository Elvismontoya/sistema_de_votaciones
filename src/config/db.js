const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones. Reutiliza conexiones en lugar de abrir una por consulta.
// SSL se activa con DB_SSL=true (necesario para Supabase).
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

// Helper para lanzar consultas simples.
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
