const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { getAllPayments, createPayment } = require('../controllers/payment.controller');

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'staff'), getAllPayments);
router.post('/', authenticate, [
  body('booking_id').isUUID().withMessage('Valid booking ID required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('method').isIn(['cash', 'card', 'mobile_money']).withMessage('Invalid payment method'),
  validate,
], createPayment);

module.exports = router;
