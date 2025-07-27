const express = require('express');
const router = express.Router();
const packageController = require('../controllers/package.controller');

// List all packages
router.get('/', packageController.listPackages);
// Get single package
router.get('/:id', packageController.getPackage);

module.exports = router; 