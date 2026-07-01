const { pool, query } = require('./db');

// Datos de prueba para la API.
const seed = async () => {
  try {
    await query('TRUNCATE votes, voters, candidates RESTART IDENTITY CASCADE');

    await query(
      `INSERT INTO voters (name, email) VALUES
       ('Elvis Montoya', 'elvis@mail.com'),
       ('Alejandra Galviz', 'alejandra@mail.com'),
       ('María López', 'maria@mail.com')`
    );

    await query(
      `INSERT INTO candidates (name, email, party) VALUES
       ('Carlos Ruiz', 'carlos@mail.com', 'Partido Liberal'),
       ('Elena Díaz', 'elena@mail.com', 'Partido Conservador')`
    );

    console.log('✅ Seed completado: 3 votantes y 2 candidatos.');
  } catch (err) {
    console.error('❌ Error en el seed:', err.message);
    throw err;
  }
};

seed()
  .then(() => pool.end())
  .catch(() => pool.end().then(() => process.exit(1)));
