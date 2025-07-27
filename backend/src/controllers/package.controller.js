const Package = require('../models/package.model');

exports.listPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json({ packages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch packages', error: err.message });
  }
};

exports.getPackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json({ package: pkg });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch package', error: err.message });
  }
}; 