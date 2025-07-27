const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { authenticate } = require('../middleware/auth.middleware');
const storageService = require('../services/storage.service');
const fs = require('fs');

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const result = await storageService.uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // Remove local file after upload
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

module.exports = router; 