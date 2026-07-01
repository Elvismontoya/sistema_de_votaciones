const voteService = require('../services/vote.service');
const asyncHandler = require('../middlewares/asyncHandler');

const cast = asyncHandler(async (req, res) => {
  const vote = await voteService.castVote(req.body);
  res.status(201).json({ status: 'success', message: 'Voto registrado.', data: vote });
});

const list = asyncHandler(async (req, res) => {
  const votes = await voteService.findAll();
  res.json({ status: 'success', data: votes });
});

const statistics = asyncHandler(async (req, res) => {
  const stats = await voteService.getStatistics();
  res.json({ status: 'success', data: stats });
});

module.exports = { cast, list, statistics };
