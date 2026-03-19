import RatingStars from './RatingStars.jsx'
import { posterUrlFromPath } from '../../lib/tmdb.js'

function ReviewCard({ username = 'User', rating = 0, text = '', movieTitle, moviePoster }) {
  return (
    <div className="rounded-2xl bg-background-secondary border border-white/5 p-6 smooth-transition hover:border-white/10 flex flex-col h-full">
      {movieTitle && (
        <div className="flex gap-4 mb-4 pb-4 border-b border-white/5">
          <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/5 shadow-lg">
            <img 
              src={posterUrlFromPath(moviePoster)} 
              alt={movieTitle} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-white font-semibold text-base truncate mb-1">{movieTitle}</h3>
            <RatingStars value={rating} readOnly size={12} />
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <img
          src={'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(username)}
          alt={`${username} avatar`}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <div className="text-white font-semibold text-sm">{username}</div>
          {!movieTitle && <RatingStars value={rating} readOnly size={14} />}
        </div>
      </div>
      {text && <p className="text-surface-300 text-sm italic line-clamp-4">"{text}"</p>}
    </div>
  )
}

export default ReviewCard

