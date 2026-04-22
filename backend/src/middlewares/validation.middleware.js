const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/helpers');

/**
 * Middleware: Check express-validator results.
 * If validation fails, returns 400 with error details.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { validate };
