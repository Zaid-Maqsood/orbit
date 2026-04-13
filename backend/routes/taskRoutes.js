const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const internal = requireRole('admin', 'manager', 'employee');
const managerPlus = requireRole('admin', 'manager');

router.get('/', verifyToken, internal, getAll);
router.post('/', verifyToken, managerPlus, create);
router.get('/:id', verifyToken, internal, getOne);
router.put('/:id', verifyToken, internal, update);
router.delete('/:id', verifyToken, managerPlus, remove);

module.exports = router;
