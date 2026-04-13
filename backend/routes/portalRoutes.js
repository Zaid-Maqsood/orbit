const express = require('express');
const router = express.Router();
const {
  getProjects, getProjectDetail, getInvoices, getMessages, sendMessage
} = require('../controllers/portalController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const clientOnly = requireRole('client');

router.get('/projects', verifyToken, clientOnly, getProjects);
router.get('/projects/:id', verifyToken, clientOnly, getProjectDetail);
router.get('/invoices', verifyToken, clientOnly, getInvoices);
router.get('/messages/:projectId', verifyToken, clientOnly, getMessages);
router.post('/messages/:projectId', verifyToken, clientOnly, sendMessage);

module.exports = router;
