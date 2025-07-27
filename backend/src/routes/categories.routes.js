import express from 'express';
import Category from '../models/category.model.js';

const router = express.Router();

// GET /api/categories - get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});

export default router; 