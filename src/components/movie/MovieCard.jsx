import { Link } from 'react-router-dom'
import MoviePoster from './MoviePoster.jsx'
import RatingStars from '../review/RatingStars.jsx'
import { motion } from 'framer-motion'
import { posterUrlFromPath } from '../../lib/tmdb.js'

function MovieCard({ movie, onRemove, className = '' }) {
  const { title, year, rating = 0, media_type } = movie || {}
  const posterUrl = movie?.posterUrl || posterUrlFromPath(movie?.poster_path)
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 28px rgba(0,0,0,0.35)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.2 }}
      className={`group relative smooth-transition rounded-xl bg-background-secondary border border-white/5 transition-transform duration-300 flex flex-col justify-between h-auto ${className}`}
    >
      {/* Media Type Badge */}
      {media_type && (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] uppercase font-bold text-yellow-400 tracking-wider">
          {media_type === 'movie' ? 'Movie' : 'TV Series'}
        </div>
      )}
      
      {onRemove && (
        <button
          type="button"
          aria-label="Remove from List"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-lg bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-600 text-white border border-white/10 transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      )}
      <div className="flex flex-col h-full">
        <Link to={`/movie/${movie?.id}?type=${media_type || 'movie'}`} className="relative block pt-[150%]">
          <div className="absolute inset-0">
            <MoviePoster src={posterUrl} alt={title} className="rounded-t-xl rounded-b-none" />
          </div>
        </Link>
        <div className="p-4 flex flex-col flex-grow justify-between">
          <h3 className="text-white font-semibold text-base break-words mb-2 h-12" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            <Link to={`/movie/${movie?.id}?type=${media_type || 'movie'}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="flex flex-col gap-2 pb-2">
            <span className="text-surface-400 text-xs font-medium uppercase tracking-wider">{year}</span>
            <div className="flex items-center gap-1 min-h-[24px] overflow-visible">
              <RatingStars value={Math.round(rating)} readOnly size={14} className="flex flex-nowrap items-center gap-1 overflow-visible" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MovieCard
