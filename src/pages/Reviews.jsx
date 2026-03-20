import { useWatchlist } from '../context/WatchlistContext.jsx'
import RatingStars from '../components/review/RatingStars.jsx'
import { posterUrlFromPath } from '../lib/tmdb.js'

function Reviews() {
  const { userReviews, deleteReview } = useWatchlist()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl sm:text-4xl text-white mb-8">My Reviews</h1>
      {userReviews?.length === 0 ? (
        <div className="text-center py-20 bg-background-secondary/30 rounded-2xl border border-dashed border-white/10 text-surface-400 italic">
          No reviews yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {userReviews?.map((review) => (
            <div key={review._id} className="bg-background-secondary p-6 rounded-2xl border border-white/5 flex gap-6 group hover:border-white/10 transition-all">
              <div className="w-24 h-36 flex-shrink-0 rounded-xl overflow-hidden border border-white/5 shadow-xl">
                <img 
                  src={posterUrlFromPath(review.moviePoster)} 
                  alt={review.movieTitle} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-xl truncate">{review.movieTitle}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <RatingStars value={review.rating} readOnly size={16} />
                      <span className="text-surface-500 text-xs uppercase tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteReview(review._id)}
                    className="text-surface-500 hover:text-red-500 p-2 rounded-xl hover:bg-red-500/10 transition-all"
                    title="Delete Review"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
                <p className="text-surface-300 text-sm mt-4 italic leading-relaxed">"{review.reviewText}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reviews
