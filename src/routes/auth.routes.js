const router = require('express').Router();
const controller = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación (JWT) - extra opcional
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Obtener un token JWT de admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@votos.com }
 *               password: { type: string, example: admin123 }
 *     responses:
 *       200: { description: Token generado }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', controller.login);

module.exports = router;
