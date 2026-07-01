const { query } = require('../config/db');
const AppError = require('../middlewares/AppError');

const create = async ({ name, email }) => {
  // Restricción: un votante no puede estar registrado como candidato.
  const candidate = await query('SELECT id FROM candidates WHERE email = $1', [email]);
  if (candidate.rowCount > 0) {
    throw new AppError('Este email ya está registrado como candidato; no puede ser votante.', 409);
  }

  const result = await query(
    `INSERT INTO voters (name, email)
     VALUES ($1, $2)
     RETURNING id, name, email, has_voted, created_at`,
    [name, email]
  );
  return result.rows[0];
};

const findAll = async ({ limit, offset, search }) => {
  const params = [];
  let where = '';

  if (search) {
    params.push(`%${search}%`);
    where = `WHERE name ILIKE $${params.length} OR email ILIKE $${params.length}`;
  }

  const totalRes = await query(`SELECT COUNT(*) FROM voters ${where}`, params);
  const total = parseInt(totalRes.rows[0].count, 10);

  params.push(limit);
  params.push(offset);
  const dataRes = await query(
    `SELECT id, name, email, has_voted, created_at
     FROM voters ${where}
     ORDER BY id
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { total, data: dataRes.rows };
};

const findById = async (id) => {
  const result = await query(
    'SELECT id, name, email, has_voted, created_at FROM voters WHERE id = $1',
    [id]
  );
  if (result.rowCount === 0) {
    throw new AppError('Votante no encontrado.', 404);
  }
  return result.rows[0];
};

const remove = async (id) => {
  const result = await query('DELETE FROM voters WHERE id = $1 RETURNING id', [id]);
  if (result.rowCount === 0) {
    throw new AppError('Votante no encontrado.', 404);
  }
  return { id: result.rows[0].id };
};

module.exports = { create, findAll, findById, remove };
