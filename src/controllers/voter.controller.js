const voterService = require('../services/voter.service');
const asyncHandler = require('../middlewares/asyncHandler');
const { getPagination, buildPaginatedResponse } = require('../services/pagination');

const create = asyncHandler(async (req, res) => {
  const voter = await voterService.create(req.body);
  res.status(201).json({ status: 'success', data: voter });
});

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset, search } = getPagination(req.query);
  const { data, total } = await voterService.findAll({ limit, offset, search });
  res.json(buildPaginatedResponse({ data, total, page, limit }));
});

const getById = asyncHandler(async (req, res) => {
  const voter = await voterService.findById(req.params.id);
  res.json({ status: 'success', data: voter });
});

const remove = asyncHandler(async (req, res) => {
  await voterService.remove(req.params.id);
  res.json({ status: 'success', message: 'Votante eliminado.' });
});

module.exports = { create, list, getById, remove };
