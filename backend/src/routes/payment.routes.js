const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Create payment intent
router.post('/intent', authenticate, paymentController.createPaymentIntent);

module.exports = router; 