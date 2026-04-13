const express = require('express');
const router = express.Router();
const { remove } = require('../controllers/deliverableController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// DELETE /api/deliverables/:id
router.delete('/:id', verifyToken, requireRole('admin', 'manager'), remove);

module.exports = router;
