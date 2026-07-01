const { query } = require('../config/db');
const AppError = require('../middlewares/AppError');

const create = async ({ name, email, party }) => {
  // Restricción: un candidato no puede estar registrado como votante.
  const voter = await query('SELECT id FROM voters WHERE email = $1', [email]);
  if (voter.rowCount > 0) {
    throw new AppError('Ese email ya está registrado como votante; no puede ser candidato.', 409);
  }

  const result = await query(
    `INSERT INTO candidates (name, email, party)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, party, votes, created_at`,
    [name, email, party || null]
  );
  return result.rows[0];
};

const findAll = async ({ limit, offset, search }) => {
  const params = [];
  let where = '';

  if (search) {
    params.push(`%${search}%`);
    where = `WHERE name ILIKE $${params.length} OR party ILIKE $${params.length}`;
  }

  const totalRes = await query(`SELECT COUNT(*) FROM candidates ${where}`, params);
  const total = parseInt(totalRes.rows[0].count, 10);

  params.push(limit);
  params.push(offset);
  const dataRes = await query(
    `SELECT id, name, email, party, votes, created_at
     FROM candidates ${where}
     ORDER BY votes DESC, id
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { total, data: dataRes.rows };
};

const findById = async (id) => {
  const result = await query(
    'SELECT id, name, email, party, votes, created_at FROM candidates WHERE id = $1',
    [id]
  );
  if (result.rowCount === 0) {
    throw new AppError('Candidato no encontrado.', 404);
  }
  return result.rows[0];
};

const remove = async (id) => {
  const result = await query('DELETE FROM candidates WHERE id = $1 RETURNING id', [id]);
  if (result.rowCount === 0) {
    throw new AppError('Candidato no encontrado.', 404);
  }
  return { id: result.rows[0].id };
};

module.exports = { create, findAll, findById, remove };
