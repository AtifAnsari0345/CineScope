import MovieCard from './MovieCard.jsx'

function PosterGrid({ movies = [], onRemove, columns, cardClassName }) {
  return (
    <div className={`grid ${columns || 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'} gap-4`}>
      {movies.map((m) => (
        <MovieCard
          key={m.id ?? m.title}
          movie={m}
          onRemove={onRemove ? () => onRemove(m.id) : undefined}
          className={cardClassName}
        />
      ))}
    </div>
  )
}

export default PosterGrid
