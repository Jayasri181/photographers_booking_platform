const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Placeholder adminOnly middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

router.get('/users', authenticate, adminOnly, adminController.listUsers);
router.get('/bookings', authenticate, adminOnly, adminController.listBookings);
router.get('/photographers', authenticate, adminOnly, adminController.listPhotographers);

module.exports = router; 