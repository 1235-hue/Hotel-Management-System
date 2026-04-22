const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { getReports } = require('../controllers/report.controller');

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'staff'), getReports);

module.exports = router;
