const express = require('express');
const router = express.Router();
const {
  getAll, getOne, create, update, remove, addMember, removeMember
} = require('../controllers/projectController');
const { getByProject: getDeliverablesByProject, create: createDeliverable } = require('../controllers/deliverableController');
const { getByProject: getMessagesByProject, create: createMessage } = require('../controllers/messageController');
const { getByProject: getTasksByProject } = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const internal = requireRole('admin', 'manager', 'employee');
const managerPlus = requireRole('admin', 'manager');

router.get('/', verifyToken, internal, getAll);
router.post('/', verifyToken, managerPlus, create);
router.get('/:id', verifyToken, internal, getOne);
router.put('/:id', verifyToken, managerPlus, update);
router.delete('/:id', verifyToken, requireRole('admin'), remove);

router.post('/:id/members', verifyToken, managerPlus, addMember);
router.delete('/:id/members/:userId', verifyToken, managerPlus, removeMember);

// Nested routes for deliverables and messages
router.get('/:projectId/deliverables', verifyToken, internal, getDeliverablesByProject);
router.post('/:projectId/deliverables', verifyToken, managerPlus, createDeliverable);
router.get('/:projectId/messages', verifyToken, getMessagesByProject);
router.post('/:projectId/messages', verifyToken, createMessage);
router.get('/:projectId/tasks', verifyToken, internal, getTasksByProject);

module.exports = router;
