const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Message routes are handled as nested routes under /api/projects/:projectId/messages
// This router is kept for potential standalone use
router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Use /api/projects/:projectId/messages' });
});

module.exports = router;
