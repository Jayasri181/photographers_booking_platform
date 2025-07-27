const express = require('express');
const router = express.Router();
const photographerController = require('../controllers/photographer.controller');

// List/search photographers
router.get('/', photographerController.getAllPhotographers);
router.get('/:id', photographerController.getPhotographerById);

module.exports = router; 