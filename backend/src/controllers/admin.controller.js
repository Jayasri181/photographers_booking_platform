const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Photographer = require('../models/photographer.model');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user photographer package');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

exports.listPhotographers = async (req, res) => {
  try {
    const photographers = await Photographer.find().populate('user', 'name email avatar');
    res.json({ photographers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch photographers', error: err.message });
  }
}; 