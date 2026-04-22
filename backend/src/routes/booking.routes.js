const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking } = require('../controllers/booking.controller');

const router = express.Router();

router.get('/', authenticate, getAllBookings);
router.get('/:id', authenticate, getBookingById);
router.post('/', authenticate, [
  body('room_id').isUUID().withMessage('Valid room ID is required'),
  body('check_in').isISO8601().withMessage('Valid check-in date required'),
  body('check_out').isISO8601().withMessage('Valid check-out date required'),
  validate,
], createBooking);
router.put('/:id', authenticate, updateBooking);
router.delete('/:id', authenticate, deleteBooking);

module.exports = router;
