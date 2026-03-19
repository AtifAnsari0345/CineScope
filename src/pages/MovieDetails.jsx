import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import RatingStars from '../components/review/RatingStars.jsx'
import ReviewCard from '../components/review/ReviewCard.jsx'
import MovieRow from '../components/movie/MovieRow.jsx'
import MoviePoster from '../components/movie/MoviePoster.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { getDetails, getPopular, getTrailer } from '../lib/tmdb.js'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

function MovieDetails() {
  const { id } = useParams()
  const location = useLocation()
  const isOnline = useOnlineStatus()
  const searchParams = new URLSearchParams(location.search)
  const mediaType = searchParams.get('type') || 'movie'
  const movieId = id
  
  const { 
    addToWatchlist, 
    removeFromWatchlist, 
    watchlist, 
    favorites, 
    toggleFavorite, 
    watched, 
    addToWatched,
    addReview
  } = useWatchlist()
  const { user } = useAuth()
  
  const [movie, setMovie] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [trailerUrl, setTrailerUrl] = useState(null)
  
  // Review form state
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [movieReviews, setMovieReviews] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const [data, pop, trailer] = await Promise.all([
          getDetails(movieId, mediaType),
          getPopular(),
          getTrailer(movieId, mediaType),
        ])
        if (!alive) return
        if (data) setMovie(data)
        if (Array.isArray(pop)) setRelated(pop.slice(0, 8))
        setTrailerUrl(trailer)
      } catch (err) {
        console.error('API Error:', err)
        if (!alive) return
        setMovie(null)
        setRelated([])
        setTrailerUrl(null)
      } finally {
        if (alive) setLoading(false)
      }
    })()

    fetchMovieReviews()

    return () => { alive = false }
  }, [movieId, mediaType])

  const fetchMovieReviews = async () => {
    if (!API_URL) {
      setMovieReviews([]);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/user/reviews/${movieId}`);
      setMovieReviews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMovieReviews([]);
    }
  };

  const isWatched = useMemo(() => {
    return watched.some(m => String(m.movieId) === String(movieId))
  }, [watched, movieId])

  const isFavorite = useMemo(() => {
    return favorites.some(m => String(m.movieId) === String(movieId))
  }, [favorites, movieId])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a rating.')
      return
    }

    const res = await addReview({
      movieId: movieId,
      movieTitle: movie?.title,
      moviePoster: movie?.poster_path,
      rating: rating,
      reviewText: reviewText
    })

    if (res.success) {
      setRating(0)
      setReviewText('')
      fetchMovieReviews() // Refresh global reviews
    } else {
      alert('Failed to post review.')
    }
  }

  const inWatchlist = useMemo(() => {
    return watchlist.some((m) => String(m.movieId) === String(movieId))
  }, [watchlist, movieId])

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!isOnline && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center animate-pulse">
          You are currently offline. Some features may be limited.
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          {loading ? (
            <div className="relative w-full pt-[150%]">
              <LoadingSkeleton className="absolute inset-0" />
            </div>
          ) : (
            movie && <MoviePoster src={movie.posterUrl} alt={movie.title} />
          )}
        </div>
        <div className="lg:col-span-8">
          {loading ? (
            <div>
              <p className="text-surface-400 mb-3">Loading movie details...</p>
              <LoadingSkeleton className="h-8 w-2/3" />
              <div className="mt-3 flex items-center gap-3">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-4 w-32" />
              </div>
              <LoadingSkeleton className="h-10 w-full mt-4" />
              <div className="mt-6 space-y-2">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-11/12" />
                <LoadingSkeleton className="h-4 w-10/12" />
              </div>
            </div>
          ) : (
            movie && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-heading text-3xl sm:text-4xl text-white">{movie.title}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-surface-400">{movie.year}</span>
                  <RatingStars value={movie.rating} readOnly />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <motion.button
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 smooth-transition ${inWatchlist ? 'bg-surface-700 text-white cursor-default' : 'bg-yellow-400 hover:bg-yellow-300 text-black font-semibold'}`}
                    onClick={() => {
                      if (!inWatchlist) addToWatchlist({ ...movie, media_type: mediaType })
                    }}
                    whileHover={inWatchlist ? undefined : { scale: 1.03 }}
                    whileTap={inWatchlist ? undefined : { scale: 0.98 }}
                  >
                    {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </motion.button>

                  <motion.button
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 smooth-transition border ${isWatched ? 'bg-green-600 border-green-600 text-white' : 'border-white/10 hover:bg-white/10 text-white'}`}
                    onClick={() => addToWatched(movie)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    {isWatched ? 'Watched' : 'Mark Watched'}
                  </motion.button>

                  <motion.button
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 smooth-transition border ${isFavorite ? 'bg-pink-600 border-pink-600 text-white' : 'border-white/10 hover:bg-white/10 text-white'}`}
                    onClick={() => toggleFavorite(movie)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {isFavorite ? 'Favourite' : 'Add Favourite'}
                  </motion.button>
                </div>

                <div className="mt-6">
                  <h2 className="font-heading text-xl text-white mb-2">Overview</h2>
                  <p className="text-surface-300">{movie.overview}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {movie.genres?.map((g) => (
                      <span key={g} className="text-xs px-2 py-1 rounded-full border border-yellow-400/50 text-yellow-400 bg-yellow-400/10">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-surface-300 text-sm">
                    {movie.runtime ? <span className="mr-4">Runtime: {movie.runtime} min</span> : null}
                    {movie.releaseDate ? <span>Release: {movie.releaseDate}</span> : null}
                  </div>
                </div>

                {trailerUrl ? (
                  <motion.a
                    href={trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 rounded-md px-4 py-2 bg-red-600 hover:bg-red-500 text-white smooth-transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M10 15V9l5 3-5 3z" />
                    </svg>
                    Watch Trailer
                  </motion.a>
                ) : null}
              </motion.div>
            )
          )}
        </div>
      </div>

      <section className="mt-12 pt-8 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Write Review Form */}
          <div className="lg:col-span-5">
            <h2 className="font-heading text-2xl text-white mb-6">Write a Review</h2>
            <form onSubmit={handleReviewSubmit} className="bg-background-secondary p-6 rounded-2xl border border-white/5">
              <div className="mb-4">
                <label className="block text-surface-400 text-sm font-medium mb-2 uppercase tracking-wider">Your Rating</label>
                <RatingStars value={rating} onChange={setRating} size={24} />
              </div>
              <div className="mb-6">
                <label className="block text-surface-400 text-sm font-medium mb-2 uppercase tracking-wider">Review Text</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you think of this film?"
                  className="w-full h-32 bg-background-primary text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl smooth-transition shadow-lg shadow-yellow-400/10"
              >
                Post Review
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-7">
            <h2 className="font-heading text-2xl text-white mb-6">User Reviews</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {movieReviews?.length === 0 ? (
                <div className="text-center py-12 bg-background-secondary/30 rounded-2xl border border-dashed border-white/10">
                  <p className="text-surface-400 italic">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                movieReviews?.map((review) => (
                  <div key={review._id} className="bg-background-secondary p-5 rounded-2xl border border-white/5 smooth-transition hover:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold">
                            {getInitials(review.userName)}
                          </div>
                        )}
                        <div>
                          <div className="text-white font-semibold text-sm">{review.userName}</div>
                          <div className="text-surface-500 text-[10px] uppercase tracking-tighter">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <RatingStars value={review.rating} readOnly size={14} />
                    </div>
                    <p className="text-surface-300 text-sm leading-relaxed">{review.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <MovieRow title="Related Movies" movies={related} />
      </section>
    </div>
  )
}

export default MovieDetails
