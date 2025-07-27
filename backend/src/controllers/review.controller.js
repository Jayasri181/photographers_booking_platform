const Review = require('../models/review.model');

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { photographerId } = req.params;
    // Prevent duplicate reviews by same user for same photographer
    const existing = await Review.findOne({ user: req.user.id, photographer: photographerId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this photographer' });
    const review = await Review.create({
      user: req.user.id,
      photographer: photographerId,
      rating,
      comment,
    });
    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};

exports.listReviews = async (req, res) => {
  try {
    const { photographerId } = req.params;
    const reviews = await Review.find({ photographer: photographerId }).populate('user', 'name avatar');
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
}; 