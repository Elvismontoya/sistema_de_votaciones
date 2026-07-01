const router = require('express').Router();
const controller = require('../controllers/voter.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../validators/validate');
const { voterRules, idParam, paginationRules } = require('../validators/rules');

/**
 * @swagger
 * tags:
 *   name: Votantes
 *   description: Gestión de votantes
 */

/**
 * @swagger
 * /voters:
 *   post:
 *     summary: Registrar un nuevo votante
 *     tags: [Votantes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, example: Elvis Montoya }
 *               email: { type: string, example: elvis@mail.com }
 *     responses:
 *       201: { description: Votante creado con exito}
 *       409: { description: Email ya usado como candidato o duplicado }
 *   get:
 *     summary: Listar votantes (con paginación y búsqueda)
 *     tags: [Votantes]
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
 *       200: { description: Lista paginada de votantes }
 */
router
  .route('/')
  .post(authenticate, voterRules, validate, controller.create)
  .get(paginationRules, validate, controller.list);

/**
 * @swagger
 * /voters/{id}:
 *   get:
 *     summary: Obtener un votante por ID
 *     tags: [Votantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Votante encontrado }
 *       404: { description: No encontrado }
 *   delete:
 *     summary: Eliminar un votante
 *     tags: [Votantes]
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
