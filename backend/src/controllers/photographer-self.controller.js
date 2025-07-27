const Photographer = require('../models/photographer.model');

exports.getProfile = async (req, res) => {
  try {
    const profile = await Photographer.findOne({ user: req.user.id }).populate('user', 'name email avatar');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await Photographer.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true }
    ).populate('user', 'name email avatar');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const profile = await Photographer.findOneAndUpdate(
      { user: req.user.id },
      { $set: { availability } },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update availability', error: err.message });
  }
}; 