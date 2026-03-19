const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /api/reviews/latest
router.get('/latest', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching latest reviews.' });
  }
});

module.exports = router;
