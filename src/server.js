require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Verifica la conexión a la base de datos antes de escuchar.
    await pool.query('SELECT 1');
    console.log('✅ Conectado a PostgreSQL.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`📚 Documentación en http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  }
};

start();
