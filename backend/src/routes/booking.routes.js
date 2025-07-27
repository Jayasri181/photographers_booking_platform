const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Create booking
router.post('/', authenticate, bookingController.createBooking);
// List bookings for user
router.get('/my', authenticate, bookingController.getMyBookings);
// Get booking by ID
router.get('/:id', authenticate, bookingController.getBookingById);

module.exports = router; 