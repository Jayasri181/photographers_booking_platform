const express = require('express');
const router = express.Router();
const photographerSelfController = require('../controllers/photographer-self.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Placeholder photographerOnly middleware
const photographerOnly = (req, res, next) => {
  if (req.user.role !== 'photographer') return res.status(403).json({ message: 'Photographer only' });
  next();
};

router.get('/me', authenticate, photographerOnly, photographerSelfController.getProfile);
router.put('/me', authenticate, photographerOnly, photographerSelfController.updateProfile);
router.put('/availability', authenticate, photographerOnly, photographerSelfController.updateAvailability);

module.exports = router; 