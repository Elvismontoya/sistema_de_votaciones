const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');

/**
 * Login sencillo con credenciales de admin definidas por variables de entorno.
 * Devuelve un JWT para usar en los endpoints protegidos (POST/DELETE).
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  const token = jwt.sign(
    { role: 'admin', email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  res.json({ status: 'success', token });
});

module.exports = { login };
