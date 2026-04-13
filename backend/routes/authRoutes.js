const express = require('express');
const router = express.Router();
const { login, me, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', verifyToken, me);
router.post('/logout', verifyToken, logout);

module.exports = router;
