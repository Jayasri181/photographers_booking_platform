const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Get current user
router.get('/me', authenticate, authController.getMe);

module.exports = router;
