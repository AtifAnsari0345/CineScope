import MovieCard from './MovieCard.jsx'

function MovieRow({ title, movies = [] }) {
  return (
    <section className="my-4">
      {title && <h2 className="font-heading text-xl text-white mb-2">{title}</h2>}
      <div className="scroll-x flex gap-4 pb-2">
        {movies.map((m) => (
          <div key={m.id ?? m.title} className="w-40 shrink-0">
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default MovieRow

