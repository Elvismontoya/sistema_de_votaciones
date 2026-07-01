const { body, param, query } = require('express-validator');

const voterRules = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ max: 120 }).withMessage('El nombre no puede superar 120 caracteres.'),
  body('email').trim().notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El email no es válido.')
    .normalizeEmail(),
];

const candidateRules = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ max: 120 }).withMessage('El nombre no puede superar 120 caracteres.'),
  body('email').trim().notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('El email no es válido.')
    .normalizeEmail(),
  body('party').optional({ nullable: true }).trim()
    .isLength({ max: 120 }).withMessage('El partido no puede superar 120 caracteres.'),
];

const voteRules = [
  body('voter_id').notEmpty().withMessage('voter_id es obligatorio.')
    .isInt({ min: 1 }).withMessage('voter_id debe ser un entero positivo.'),
  body('candidate_id').notEmpty().withMessage('candidate_id es obligatorio.')
    .isInt({ min: 1 }).withMessage('candidate_id debe ser un entero positivo.'),
];

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.'),
];

const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1.'),
  query('limit').optional().isInt({ min: 1, max: 100 })
    .withMessage('limit debe estar entre 1 y 100.'),
];

module.exports = {
  voterRules,
  candidateRules,
  voteRules,
  idParam,
  paginationRules,
};
