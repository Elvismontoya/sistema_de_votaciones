const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * Protege rutas exigiendo un Bearer token válido.
 * Extra opcional de la prueba (autenticación con JWT).
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Token no proporcionado. Use el header Authorization: Bearer <token>.', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(new AppError('Token inválido o expirado.', 401));
  }
};

module.exports = authenticate;
