import { useWatchlist } from '../context/WatchlistContext.jsx'
import MovieCard from '../components/movie/MovieCard.jsx'

function Watched() {
  const { watched } = useWatchlist()

  const mapMovie = (m) => ({
    id: m.movieId,
    title: m.title,
    poster_path: m.poster,
    media_type: m.media_type,
    year: m.year,
    vote_average: m.rating * 2
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl sm:text-4xl text-white mb-8">Watched</h1>
      {watched.length === 0 ? (
        <div className="text-center py-20 bg-background-secondary/30 rounded-2xl border border-dashed border-white/10 text-surface-400 italic">
          No watched items yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watched.map((movie) => (
            <MovieCard 
              key={movie.movieId} 
              movie={mapMovie(movie)} 
              onRemove={() => {}} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Watched