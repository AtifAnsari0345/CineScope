import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/ui/SearchBar.jsx'
import PosterGrid from '../components/movie/PosterGrid.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { searchMulti } from '../lib/tmdb.js'

function Search() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [contentType, setContentType] = useState('both') // both, movie, tv
  const [sortBy, setSortBy] = useState('popularity') // popularity, rating, newest

  function handleSearch(q) {
    if (!q.trim()) {
      setResults([])
      setQuery('')
      return
    }
    setQuery(q)
    setLoading(true)
  }

  useEffect(() => {
    if (loading && query.trim()) {
      const t = setTimeout(() => {
        ;(async () => {
          const apiResults = await searchMulti(query.trim())
          const filteredResults = apiResults?.filter(m => m.title && m.poster_path) || []
          setResults(filteredResults)
          setLoading(false)
        })()
      }, 500)
      return () => clearTimeout(t)
    } else {
      setLoading(false)
    }
  }, [loading, query])

  const filteredAndSortedResults = useMemo(() => {
    let list = [...results]

    // Content Type Filter
    if (contentType !== 'both') {
      list = list.filter(item => item.media_type === contentType)
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'popularity') {
        return (b.popularity || 0) - (a.popularity || 0)
      } else if (sortBy === 'rating') {
        return (b.vote_average || 0) - (a.vote_average || 0)
      } else if (sortBy === 'newest') {
        const dateA = new Date(a.release_date || 0)
        const dateB = new Date(b.release_date || 0)
        return dateB - dateA
      }
      return 0
    })

    return list
  }, [results, contentType, sortBy])

  const skeletons = useMemo(() => Array.from({ length: 10 }), [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-white mb-6">Search Movies & TV Series</h1>
        <div className="max-w-xl mx-auto">
          <SearchBar onSubmit={handleSearch} />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 bg-background-secondary/50 p-4 rounded-xl border border-white/5">
          <div className="flex flex-col items-start gap-1.5">
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-1">Content Type</label>
            <div className="flex bg-background-primary rounded-lg p-1 border border-white/5">
              {['both', 'movie', 'tv'].map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium smooth-transition ${contentType === type ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-surface-400 hover:text-white'}`}
                >
                  {type === 'both' ? 'All' : type === 'movie' ? 'Movies' : 'TV Series'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-10 w-px bg-white/10 hidden sm:block mx-2" />

          <div className="flex flex-col items-start gap-1.5">
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-1">Sort By</label>
            <div className="flex bg-background-primary rounded-lg p-1 border border-white/5">
              {[
                { label: 'Popularity', value: 'popularity' },
                { label: 'Top Rated', value: 'rating' },
                { label: 'Newest', value: 'newest' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium smooth-transition ${sortBy === option.value ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-surface-400 hover:text-white'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {skeletons.map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="w-full aspect-[2/3]">
                <LoadingSkeleton className="w-full h-full" />
              </div>
              <LoadingSkeleton className="h-4 mt-3 w-3/4" />
              <LoadingSkeleton className="h-3 mt-1.5 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {query && filteredAndSortedResults.length === 0 ? (
            <div className="text-center py-20 bg-background-secondary/30 rounded-2xl border border-dashed border-white/10">
              <p className="text-surface-400 text-lg italic">No results found for "{query}" with the selected filters.</p>
            </div>
          ) : (
            <PosterGrid movies={filteredAndSortedResults.slice(0, 20)} />
          )}
        </>
      )}
    </div>
  )
}

export default Search
