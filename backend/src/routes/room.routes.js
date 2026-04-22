const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/room.controller');

const router = express.Router();

router.get('/', getAllRooms); // Public
router.get('/:id', getRoomById);
router.post('/', authenticate, authorize('admin', 'staff'), [
  body('number').notEmpty().withMessage('Room number is required'),
  body('type').isIn(['single', 'double', 'deluxe', 'suite']).withMessage('Invalid room type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  validate,
], createRoom);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateRoom);
router.delete('/:id', authenticate, authorize('admin'), deleteRoom);

module.exports = router;
