import PosterGrid from '../components/movie/PosterGrid.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'

function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist()

  const mappedWatchlist = watchlist?.map(m => ({
    id: m.movieId,
    title: m.title,
    poster_path: m.poster,
    media_type: m.media_type,
    year: m.year,
    vote_average: Number(m?.rating ?? m?.vote_average ?? 0) || 0
  })) || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl sm:text-4xl text-white">My Watchlist</h1>
      </div>

      {watchlist?.length === 0 ? (
        <div className="text-center text-surface-300 py-16">
          <p>No movies in your watchlist yet.</p>
        </div>
      ) : (
        <PosterGrid movies={mappedWatchlist} onRemove={removeFromWatchlist} />
      )}
    </div>
  )
}

export default Watchlist
