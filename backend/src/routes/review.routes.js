const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Add review
router.post('/:photographerId', authenticate, reviewController.addReview);
// List reviews for a photographer
router.get('/:photographerId', reviewController.listReviews);

module.exports = router; 