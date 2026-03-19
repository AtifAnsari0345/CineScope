const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Review = require('../models/Review');

// Get user profile and data
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
});

// Watchlist: Add
router.post('/watchlist/add', auth, async (req, res) => {
  try {
    const { movieId, title, poster, media_type, year, rating } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Check if already in watchlist
    const exists = user.watchlist.some(m => m.movieId === movieId);
    if (exists) return res.status(400).json({ message: 'Already in watchlist.' });

    user.watchlist.push({ movieId, title, poster, media_type, year, rating });
    await user.save();
    res.json(user.watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Watchlist: Remove
router.delete('/watchlist/remove/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.watchlist = user.watchlist.filter(m => m.movieId !== req.params.movieId);
    await user.save();
    res.json(user.watchlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Favorites: Add
router.post('/favorites/add', auth, async (req, res) => {
  try {
    const { movieId, title, poster, media_type, year, rating } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const exists = user.favorites.some(m => m.movieId === movieId);
    if (exists) return res.status(400).json({ message: 'Already in favorites.' });

    user.favorites.push({ movieId, title, poster, media_type, year, rating });
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Favorites: Remove
router.delete('/favorites/remove/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.favorites = user.favorites.filter(m => m.movieId !== req.params.movieId);
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Watched: Add
router.post('/watched/add', auth, async (req, res) => {
  try {
    const { movieId, title, poster, media_type, year, rating } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const exists = user.watched.some(m => m.movieId === movieId);
    if (exists) return res.status(400).json({ message: 'Already marked as watched.' });

    user.watched.push({ movieId, title, poster, media_type, year, rating });
    await user.save();
    res.json(user.watched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Watched: Remove
router.delete('/watched/remove/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.watched = user.watched.filter(m => m.movieId !== req.params.movieId);
    await user.save();
    res.json(user.watched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reviews: Add
router.post('/review/add', auth, async (req, res) => {
  try {
    const { movieId, movieTitle, moviePoster, reviewText, rating } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const newReview = new Review({
      userId: user._id,
      username: user.name,
      movieId,
      movieTitle,
      moviePoster,
      reviewText,
      rating,
      createdAt: new Date()
    });
    await newReview.save();

    user.reviews.push({ movieId, movieTitle, moviePoster, reviewText, rating, createdAt: new Date() });
    await user.save();
    res.json(user.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reviews: Get for a movie (Global)
router.get('/reviews/:movieId', async (req, res) => {
  try {
    // To make it global, we find all users who reviewed this movie
    const users = await User.find({ 'reviews.movieId': req.params.movieId });
    let movieReviews = [];
    users.forEach(u => {
      u.reviews.forEach(r => {
        if (r.movieId === req.params.movieId) {
          movieReviews.push({
            ...r.toObject(),
            userName: u.name
          });
        }
      });
    });
    // Sort by newest
    movieReviews.sort((a, b) => b.createdAt - a.createdAt);
    res.json(movieReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reviews: Delete
router.delete('/review/delete/:reviewId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.reviews = user.reviews.filter(r => String(r._id) !== req.params.reviewId);
    await user.save();
    res.json(user.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
