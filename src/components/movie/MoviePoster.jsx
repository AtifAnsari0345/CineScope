import { useState } from 'react'
import LoadingSkeleton from '../ui/LoadingSkeleton.jsx'
import { motion } from 'framer-motion'
import { posterUrlFromPath } from '../../lib/tmdb.js'

function MoviePoster({ src, alt, className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const effectiveSrc = src || posterUrlFromPath('')

  return (
    <div className={`relative w-full pt-[150%] overflow-hidden rounded-lg hover-lift ${className}`}>
      {!loaded && (
        <LoadingSkeleton className="absolute inset-0" />
      )}
      <motion.img
        src={effectiveSrc}
        alt={alt || 'Poster'}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover smooth-transition"
      />
    </div>
  )
}

export default MoviePoster
