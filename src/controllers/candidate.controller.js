const candidateService = require('../services/candidate.service');
const asyncHandler = require('../middlewares/asyncHandler');
const { getPagination, buildPaginatedResponse } = require('../services/pagination');

const create = asyncHandler(async (req, res) => {
  const candidate = await candidateService.create(req.body);
  res.status(201).json({ status: 'success', data: candidate });
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset, search } = getPagination(req.query);
  const { data, total } = await candidateService.findAll({ limit, offset, search });
  res.json(buildPaginatedResponse({ data, total, page, limit }));
});

const getById = asyncHandler(async (req, res) => {
  const candidate = await candidateService.findById(req.params.id);
  res.json({ status: 'success', data: candidate });
});

const remove = asyncHandler(async (req, res) => {
  await candidateService.remove(req.params.id);
  res.json({ status: 'success', message: 'Candidato eliminado.' });
});

module.exports = { create, list, getById, remove };
