const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'staff', 'customer']),
  validate,
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], login);

module.exports = router;
