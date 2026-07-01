const { pool } = require('./db');

/**
 * Crea el esquema de la base de datos.
 *
* Validaciones de integridad:
 *  - "Un votante no puede ser candidato y viceversa": se valida en la capa de
 *    servicio comparando el email. El email es UNIQUE en cada tabla.
 *  - "Cada votante emite un único voto": la columna voter_id en `votes` es UNIQUE,
 *    de modo que la base de datos rechaza un segundo voto aunque falle la validación
 *    en la app (doble seguridad).
 *  - Los votos se cuentan en la tabla `votes`; el contador denormalizado
 *    candidates.votes se mantiene dentro de una transacción al emitir el voto.
 */
const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS voters (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(120) NOT NULL,
        email       VARCHAR(160) NOT NULL UNIQUE,
        has_voted   BOOLEAN NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(120) NOT NULL,
        email       VARCHAR(160) NOT NULL UNIQUE,
        party       VARCHAR(120),
        votes       INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id            SERIAL PRIMARY KEY,
        voter_id      INTEGER NOT NULL UNIQUE
                        REFERENCES voters(id) ON DELETE CASCADE,
        candidate_id  INTEGER NOT NULL
                        REFERENCES candidates(id) ON DELETE CASCADE,
        created_at    TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_votes_candidate ON votes(candidate_id);'
    );

    await client.query('COMMIT');
    console.log('✅ Migración completada: tablas voters, candidates y votes creadas.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en la migración:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

createTables()
  .then(() => pool.end())
  .catch(() => pool.end().then(() => process.exit(1)));
