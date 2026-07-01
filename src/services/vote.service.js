const { pool, query } = require('../config/db');
const AppError = require('../middlewares/AppError');

/**
 * Emite un voto de forma atómica dentro de una transacción:
 *  1. Bloquea la fila del votante (FOR UPDATE) para evitar votos simultáneos.
 *  2. Verifica que el votante exista y no haya votado.
 *  3. Verifica que el candidato exista.
 *  4. Inserta el voto (voter_id es UNIQUE => segunda barrera anti-duplicado).
 *  5. Incrementa el contador del candidato y marca al votante como has_voted.
 * Si algo falla, ROLLBACK deja todo consistente.
 */
const castVote = async ({ voter_id, candidate_id }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const voterRes = await client.query(
      'SELECT id, has_voted FROM voters WHERE id = $1 FOR UPDATE',
      [voter_id]
    );
    if (voterRes.rowCount === 0) {
      throw new AppError('El votante no existe.', 404);
    }
    if (voterRes.rows[0].has_voted) {
      throw new AppError('El votante ya ha emitido su voto.', 409);
    }

    const candidateRes = await client.query(
      'SELECT id FROM candidates WHERE id = $1',
      [candidate_id]
    );
    if (candidateRes.rowCount === 0) {
      throw new AppError('El candidato no existe.', 404);
    }

    const voteRes = await client.query(
      `INSERT INTO votes (voter_id, candidate_id)
       VALUES ($1, $2)
       RETURNING id, voter_id, candidate_id, created_at`,
      [voter_id, candidate_id]
    );

    await client.query(
      'UPDATE candidates SET votes = votes + 1 WHERE id = $1',
      [candidate_id]
    );

    await client.query(
      'UPDATE voters SET has_voted = TRUE WHERE id = $1',
      [voter_id]
    );

    await client.query('COMMIT');
    return voteRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const findAll = async () => {
  const result = await query(
    `SELECT v.id, v.voter_id, v.candidate_id, v.created_at,
            vo.name AS voter_name, c.name AS candidate_name
     FROM votes v
     JOIN voters vo ON vo.id = v.voter_id
     JOIN candidates c ON c.id = v.candidate_id
     ORDER BY v.id`
  );
  return result.rows;
};

const getStatistics = async () => {
  const totalVotesRes = await query('SELECT COUNT(*)::int AS total FROM votes');
  const totalVotes = totalVotesRes.rows[0].total;

  const votersVotedRes = await query(
    'SELECT COUNT(*)::int AS total FROM voters WHERE has_voted = TRUE'
  );
  const totalVotersVoted = votersVotedRes.rows[0].total;

  const perCandidateRes = await query(
    `SELECT id AS candidate_id, name, party, votes
     FROM candidates
     ORDER BY votes DESC, id`
  );

  const results = perCandidateRes.rows.map((c) => ({
    candidate_id: c.candidate_id,
    name: c.name,
    party: c.party,
    votes: c.votes,
    percentage:
      totalVotes === 0 ? 0 : Number(((c.votes / totalVotes) * 100).toFixed(2)),
  }));

  return {
    total_votes: totalVotes,
    total_voters_voted: totalVotersVoted,
    results,
  };
};

module.exports = { castVote, findAll, getStatistics };
