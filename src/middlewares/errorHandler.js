const AppError = require('./AppError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Errores controlados de la aplicación
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Violación de restricción UNIQUE de PostgreSQL (código 23505)
  if (err.code === '23505') {
    return res.status(409).json({
      status: 'error',
      message: 'Ya existe un registro con ese valor único (email o voto duplicado).',
    });
  }

  // Violación de llave foránea (código 23503)
  if (err.code === '23503') {
    return res.status(400).json({
      status: 'error',
      message: 'Referencia inválida: el votante o candidato no existe.',
    });
  }

  console.error('Error no controlado:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor.',
  });
};

// Manejador para rutas no encontradas
const notFound = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
