const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String, required: true },
  media_type: { type: String, default: 'movie' },
  year: { type: Number },
  rating: { type: Number },
  addedAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: 'Movie lover' },
  watchlist: [movieSchema],
  favorites: [movieSchema],
  watched: [movieSchema],
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
