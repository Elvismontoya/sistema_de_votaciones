// Normaliza los parámetros de paginación de la query string.
const getPagination = (queryParams) => {
  const page = Math.max(parseInt(queryParams.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(queryParams.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset, search: queryParams.search || null };
};

// Construye la envoltura de respuesta paginada.
const buildPaginatedResponse = ({ data, total, page, limit }) => ({
  status: 'success',
  meta: {
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit) || 1,
  },
  data,
});

module.exports = { getPagination, buildPaginatedResponse };
