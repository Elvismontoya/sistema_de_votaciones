const router = require('express').Router();
const controller = require('../controllers/vote.controller');
const validate = require('../validators/validate');
const { voteRules } = require('../validators/rules');

/**
 * @swagger
 * tags:
 *   name: Votos
 *   description: Emisión de votos y estadísticas
 */

/**
 * @swagger
 * /votes/statistics:
 *   get:
 *     summary: Estadísticas de la votación
 *     tags: [Votos]
 *     description: Total de votos por candidato, porcentaje y total de votantes que han votado.
 *     responses:
 *       200: { description: Estadísticas calculadas }
 */
router.get('/statistics', controller.statistics);

/**
 * @swagger
 * /votes:
 *   post:
 *     summary: Emitir un voto
 *     tags: [Votos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voter_id, candidate_id]
 *             properties:
 *               voter_id: { type: integer, example: 1 }
 *               candidate_id: { type: integer, example: 2 }
 *     responses:
 *       201: { description: Voto registrado }
 *       409: { description: El votante ya realizo su votó }
 *       404: { description: Votante o candidato inexistente }
 *   get:
 *     summary: Listar todos los votos emitidos
 *     tags: [Votos]
 *     responses:
 *       200: { description: Lista de votos }
 */
router
  .route('/')
  .post(voteRules, validate, controller.cast)
  .get(controller.list);

module.exports = router;
