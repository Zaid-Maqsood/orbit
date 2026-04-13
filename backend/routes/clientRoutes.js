const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/clientController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/', verifyToken, requireRole('admin', 'manager'), getAll);
router.post('/', verifyToken, requireRole('admin', 'manager'), create);
router.get('/:id', verifyToken, requireRole('admin', 'manager'), getOne);
router.put('/:id', verifyToken, requireRole('admin', 'manager'), update);
router.delete('/:id', verifyToken, requireRole('admin'), remove);

module.exports = router;
