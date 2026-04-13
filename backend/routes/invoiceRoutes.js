const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/invoiceController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const managerPlus = requireRole('admin', 'manager');

router.get('/', verifyToken, managerPlus, getAll);
router.post('/', verifyToken, managerPlus, create);
router.get('/:id', verifyToken, managerPlus, getOne);
router.put('/:id', verifyToken, managerPlus, update);
router.delete('/:id', verifyToken, requireRole('admin'), remove);

module.exports = router;
