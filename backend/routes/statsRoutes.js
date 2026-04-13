const express = require('express');
const router = express.Router();
const { overview } = require('../controllers/statsController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/overview', verifyToken, requireRole('admin', 'manager'), overview);

module.exports = router;
