const router = require('express').Router();
const controller = require('../controllers/candidate.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../validators/validate');
const { candidateRules, idParam, paginationRules } = require('../validators/rules');

/**
 * @swagger
 * tags:
 *   name: Candidatos
 *   description: Gestión de candidatos
 */

/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Registrar un nuevo candidato
 *     tags: [Candidatos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, example: Carlos Ruiz }
 *               email: { type: string, example: carlos@mail.com }
 *               party: { type: string, example: Partido Liberal }
 *     responses:
 *       201: { description: Candidato creado con exito}
 *       409: { description: Email ya usado como votante o duplicado }
 *   get:
 *     summary: Listar candidatos (con paginación y búsqueda)
 *     tags: [Candidatos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista paginada de candidatos }
 */
router
  .route('/')
  .post(authenticate, candidateRules, validate, controller.create)
  .get(paginationRules, validate, controller.list);

/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Obtener un candidato por ID
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Candidato encontrado }
 *       404: { description: No encontrado }
 *   delete:
 *     summary: Eliminar un candidato
 *     tags: [Candidatos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No encontrado }
 */
router
  .route('/:id')
  .get(idParam, validate, controller.getById)
  .delete(authenticate, idParam, validate, controller.remove);

module.exports = router;
