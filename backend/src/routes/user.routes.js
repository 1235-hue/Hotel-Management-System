const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { getAllUsers, getUserById, updateUserRole } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id/role', authenticate, authorize('admin'), updateUserRole);

module.exports = router;
