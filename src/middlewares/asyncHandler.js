/**
 * Envuelve controladores async y reenvía cualquier error a next(),
 * evitando repetir try/catch en cada controlador.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
