import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/ui/SearchBar.jsx'
import PosterGrid from '../components/movie/PosterGrid.jsx'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { discoverByFilters, getActorCreditIds, getActorCreditsMedia, searchMulti } from '../lib/tmdb.js'

function FilterDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find((option) => String(option.value) === String(value))
  const label = selected?.label || placeholder

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-2xl border border-yellow-400/70 bg-gradient-to-br from-slate-900 to-slate-950 text-white px-4 py-3 text-sm font-semibold text-left smooth-transition hover:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 shadow-lg shadow-black/20"
      >
        <span className="truncate pr-8 block">{label}</span>
        <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-yellow-300 smooth-transition ${open ? 'rotate-180' : ''}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-yellow-400/35 bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-black/40">
          <div className="max-h-56 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={String(option.value) || option.label}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm smooth-transition ${
                  String(option.value) === String(value)
                    ? 'bg-yellow-400/15 text-yellow-300'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Search() {
  const navigate = useNavigate()
  const [inputQuery, setInputQuery] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [isApplyingFilters, setIsApplyingFilters] = useState(false)
  const [searchInfoMessage, setSearchInfoMessage] = useState('')
  const [rawResults, setRawResults] = useState([])
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [contentType, setContentType] = useState('both') // both, movie, tv
  const [sortBy, setSortBy] = useState('popularity') // popularity, rating, newest
  const [language, setLanguage] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [rating, setRating] = useState('')
  const [actor, setActor] = useState('')
  const hasDiscoveryFilters = useMemo(
    () => Boolean(language || genre || year || rating || actor.trim() || contentType !== 'both'),
    [language, genre, year, rating, actor, contentType]
  )

  const genres = useMemo(
    () => ({
      Action: 28,
      Comedy: 35,
      Drama: 18,
      Horror: 27,
      Romance: 10749,
      Thriller: 53,
      SciFi: 878
    }),
    []
  )

  const languageOptions = useMemo(
    () => [
      { label: 'All', value: '' },
      { label: 'English', value: 'en' },
      { label: 'Hindi', value: 'hi' },
      { label: 'Korean', value: 'ko' },
      { label: 'Japanese', value: 'ja' },
      { label: 'Spanish', value: 'es' }
    ],
    []
  )

  const genreOptions = useMemo(
    () => [
      { label: 'All Genres', value: '' },
      ...Object.entries(genres).map(([name, id]) => ({ label: name, value: String(id) }))
    ],
    [genres]
  )

  const ratingOptions = useMemo(
    () => [
      { label: 'All Ratings', value: '' },
      { label: '7+', value: '7' },
      { label: '8+', value: '8' },
      { label: '9+', value: '9' }
    ],
    []
  )

  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '')

  const isMatch = (a, b) => {
    const left = normalize(a)
    const right = normalize(b)
    return left.includes(right) || right.includes(left)
  }

  const getRelaxedQuery = (value) => {
    const cleaned = value.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
    if (!cleaned) return ''
    const firstWord = cleaned.split(' ')[0]
    return firstWord
  }

  const getDisplayTitle = (item) => item.title || item.name || ''

  function handleSearch(q) {
    setInputQuery(q)
  }

  function handleSuggestionClick(item) {
    const title = getDisplayTitle(item)
    setInputQuery(title)
    setQuery(title)
    setShowSuggestions(false)
    navigate(`/movie/${item.id}?type=${item.media_type || 'movie'}`)
  }

  function clearFilters() {
    setLanguage('')
    setGenre('')
    setYear('')
    setRating('')
    setActor('')
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      const next = inputQuery.trim()
      setQuery(next)
      if (!next) {
        setRawResults([])
        setResults([])
        setSuggestions([])
        setSearchInfoMessage('')
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [inputQuery])

  useEffect(() => {
    let alive = true

    const fetchMovies = async () => {
      if (!query && !hasDiscoveryFilters) {
        setRawResults([])
        setResults([])
        setSuggestions([])
        setSearchInfoMessage('')
        setLoading(false)
        return
      }
      setLoading(true)
      setSearchInfoMessage('')
      try {
        let baseResults = []

        if (query) {
          const primary = await searchMulti(query)
          baseResults = (primary || []).filter((item) => {
            const title = getDisplayTitle(item)
            return title && item.poster_path
          })

          if (baseResults.length === 0) {
            const fallbackQuery = getRelaxedQuery(query)
            if (fallbackQuery && fallbackQuery.toLowerCase() !== query.toLowerCase()) {
              const fallback = await searchMulti(fallbackQuery)
              const fallbackResults = (fallback || []).filter((item) => {
                const title = getDisplayTitle(item)
                return title && item.poster_path
              })
              if (fallbackResults.length > 0) {
                baseResults = fallbackResults
                if (alive) {
                  setSearchInfoMessage('No exact results found. Showing similar results...')
                }
              }
            }
          }

          const fuzzyResults = baseResults.filter((item) => {
            const title = getDisplayTitle(item)
            return isMatch(title, query)
          })

          baseResults = fuzzyResults.length > 0 ? fuzzyResults : baseResults

          if (!actor.trim()) {
            const castResults = await getActorCreditsMedia(query)
            if (castResults.length > 0) {
              baseResults = castResults
              if (alive) {
                setSearchInfoMessage(`Showing cast results for "${query}"`)
              }
            }
          }
        } else {
          if (actor.trim()) {
            baseResults = await getActorCreditsMedia(actor.trim())
          } else {
            baseResults = await discoverByFilters({
              contentType,
              language,
              genre,
              year,
              rating,
              actor: ''
            })
          }
        }

        if (!alive) return
        setRawResults(baseResults)
        setSuggestions(query ? baseResults.slice(0, 5) : [])
      } catch (err) {
        console.error('API Error:', err)
        if (!alive) return
        setRawResults([])
        setResults([])
        setSuggestions([])
      } finally {
        if (alive) setLoading(false)
      }
    }

    fetchMovies()
    return () => {
      alive = false
    }
  }, [query, hasDiscoveryFilters, contentType, language, genre, year, rating, actor])

  useEffect(() => {
    if (!query) {
      setShowSuggestions(false)
      return
    }
    if (!inputQuery.trim()) {
      setShowSuggestions(false)
    } else if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }, [query, inputQuery, suggestions])

  useEffect(() => {
    if (!query && !hasDiscoveryFilters) {
      setLoading(false)
    }
  }, [query, hasDiscoveryFilters])

  useEffect(() => {
    let alive = true
    const applyFilters = async () => {
      let filtered = [...rawResults]

      if (language) {
        filtered = filtered.filter((item) => item.original_language === language)
      }

      if (genre) {
        filtered = filtered.filter((item) => item.genre_ids?.includes(Number(genre)))
      }

      if (year) {
        filtered = filtered.filter((item) => {
          const date = item.release_date || item.first_air_date
          return date?.startsWith(year)
        })
      }

      if (rating) {
        filtered = filtered.filter((item) => item.vote_average >= Number(rating))
      }

      if (actor.trim() && query) {
        setIsApplyingFilters(true)
        const actorMovieIds = await getActorCreditIds(actor.trim())
        if (!alive) return
        filtered = filtered.filter((movie) => actorMovieIds.has(movie.id))
      } else {
        setIsApplyingFilters(false)
      }

      if (contentType !== 'both') {
        filtered = filtered.filter((item) => item.media_type === contentType)
      }

      filtered.sort((a, b) => {
        if (sortBy === 'popularity') {
          return (b.popularity || 0) - (a.popularity || 0)
        }
        if (sortBy === 'rating') {
          return (b.vote_average || 0) - (a.vote_average || 0)
        }
        if (sortBy === 'newest') {
          const dateA = new Date(a.release_date || a.first_air_date || 0)
          const dateB = new Date(b.release_date || b.first_air_date || 0)
          return dateB - dateA
        }
        return 0
      })

      if (alive) {
        setResults(filtered)
        if (actor.trim() && query) setIsApplyingFilters(false)
      }
    }

    applyFilters()
    return () => {
      alive = false
    }
  }, [rawResults, language, genre, year, rating, actor, contentType, sortBy, query])

  const activeFilterSummary = useMemo(() => {
    if (!query && !hasDiscoveryFilters) return ''
    const languageLabel = languageOptions.find((option) => option.value === language)?.label
    const genreLabel = Object.keys(genres).find((key) => String(genres[key]) === String(genre))
    const segments = [query ? `Showing results for "${query}"` : 'Showing discovered results']
    if (language) segments.push(languageLabel || language)
    if (genre) segments.push(genreLabel || `Genre ${genre}`)
    if (year) segments.push(`Year ${year}`)
    if (rating) segments.push(`Rating ${rating}+`)
    if (actor.trim()) segments.push(`Actor ${actor.trim()}`)
    if (contentType !== 'both') segments.push(contentType === 'tv' ? 'TV Series' : 'Movies')
    return segments.join(' | ')
  }, [query, hasDiscoveryFilters, language, genre, year, rating, actor, contentType, genres, languageOptions])

  const skeletons = useMemo(() => Array.from({ length: 10 }), [])

  const highlightedSuggestion = (title) => {
    const queryText = inputQuery.trim()
    if (!queryText) return title
    const lowerTitle = title.toLowerCase()
    const lowerQuery = queryText.toLowerCase()
    const start = lowerTitle.indexOf(lowerQuery)
    if (start === -1) return title
    const end = start + queryText.length
    return (
      <>
        {title.slice(0, start)}
        <span className="text-yellow-400 font-semibold">{title.slice(start, end)}</span>
        {title.slice(end)}
      </>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-white mb-6">Search Movies & TV Series</h1>
        <div className="max-w-xl mx-auto relative">
          <SearchBar
            onSubmit={handleSearch}
            value={inputQuery}
            onChange={setInputQuery}
            onFocus={() => {
              if (suggestions.length > 0 && query) setShowSuggestions(true)
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 120)
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-30 mt-2 w-full rounded-xl border border-yellow-400/40 bg-gray-900/95 backdrop-blur-md shadow-2xl overflow-hidden text-left">
              {suggestions.map((item) => {
                const title = getDisplayTitle(item)
                return (
                  <button
                    type="button"
                    key={`${item.media_type}-${item.id}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-yellow-400/10 smooth-transition border-b border-white/5 last:border-b-0"
                  >
                    <img
                      src={item.posterUrl}
                      alt={title}
                      className="h-12 w-9 rounded object-cover flex-shrink-0 border border-white/10"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="text-white text-sm truncate">{highlightedSuggestion(title)}</div>
                      <div className="text-surface-400 text-xs uppercase tracking-wide">
                        {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div className="mt-6 w-full rounded-2xl border border-yellow-400/25 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-4 sm:p-5 shadow-xl shadow-black/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            <FilterDropdown
              value={language}
              onChange={setLanguage}
              options={languageOptions}
              placeholder="Language"
            />
            <FilterDropdown
              value={genre}
              onChange={setGenre}
              options={genreOptions}
              placeholder="Genre"
            />
            <input
              type="text"
              inputMode="numeric"
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Year"
              className="w-full rounded-xl border border-yellow-400/60 bg-slate-900/90 text-white px-4 py-3 text-sm font-medium outline-none smooth-transition focus:border-yellow-300 focus:ring-2 focus:ring-yellow-400/40"
            />
            <FilterDropdown
              value={rating}
              onChange={setRating}
              options={ratingOptions}
              placeholder="Rating"
            />
            <input
              type="text"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              placeholder="Actor"
              className="w-full rounded-xl border border-yellow-400/60 bg-slate-900/90 text-white px-4 py-3 text-sm font-medium outline-none smooth-transition focus:border-yellow-300 focus:ring-2 focus:ring-yellow-400/40"
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-surface-400 text-xs uppercase tracking-[0.18em]">Smart Filters</div>
            <button
              type="button"
              onClick={clearFilters}
              className="self-start sm:self-auto rounded-xl border border-yellow-400/80 bg-slate-900/80 px-4 py-2.5 text-white text-sm font-semibold hover:bg-yellow-400 hover:text-black smooth-transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 bg-background-secondary/50 p-4 rounded-xl border border-white/5">
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

      {activeFilterSummary && (
        <div className="mb-5 text-center text-surface-300 text-sm bg-background-secondary/30 border border-white/10 rounded-lg py-2 px-3">
          {activeFilterSummary}
        </div>
      )}

      {searchInfoMessage && (
        <div className="mb-4 text-center text-yellow-300 text-sm bg-yellow-500/10 border border-yellow-400/30 rounded-lg py-2 px-3">
          {searchInfoMessage}
        </div>
      )}

      {loading || isApplyingFilters ? (
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
          {(query || hasDiscoveryFilters) && results.length === 0 ? (
            <div className="text-center py-20 bg-background-secondary/30 rounded-2xl border border-dashed border-white/10">
              <p className="text-surface-400 text-lg italic">No results found. Try different keywords.</p>
            </div>
          ) : (
            <PosterGrid movies={results.slice(0, 20)} />
          )}
        </>
      )}
    </div>
  )
}

export default Search
