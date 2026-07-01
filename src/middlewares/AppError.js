/**
 * Error operacional con código HTTP. Permite lanzar errores controlados
 * desde los servicios y que el manejador central responda con el status correcto.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
