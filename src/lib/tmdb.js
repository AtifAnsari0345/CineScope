const API_BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const PLACEHOLDER = 'https://via.placeholder.com/500x750?text=No+Poster'

function getKey() {
  return import.meta.env.VITE_TMDB_API_KEY
}

function toMovie(item) {
  const release = item.release_date || item.first_air_date || ''
  const title = item.title || item.name || ''
  const year = release ? Number(release.slice(0, 4)) : undefined
  return {
    id: item.id,
    title,
    name: item.name || '',
    year,
    rating: Math.round((item.vote_average || 0) / 2), // 10 -> 5
    poster_path: item.poster_path || '',
    posterUrl: posterUrlFromPath(item.poster_path),
    vote_average: item.vote_average || 0,
    release_date: item.release_date || '',
    first_air_date: item.first_air_date || '',
    media_type: item.media_type || (item.title ? 'movie' : 'tv'),
    popularity: item.popularity || 0,
    original_language: item.original_language || '',
    genre_ids: Array.isArray(item.genre_ids) ? item.genre_ids : [],
  }
}

async function fetchJson(path, params = {}) {
  try {
    const key = getKey()
    if (!key) return null
    const url = new URL(`${API_BASE}${path}`)
    url.searchParams.set('api_key', key)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    const res = await fetch(url.toString())
    if (!res.ok) return null
    return res.json()
  } catch (err) {
    console.error('API Error:', err)
    return null
  }
}

export async function getTrending() {
  const data = await fetchJson('/trending/movie/day')
  if (!data || !data.results) return []
  return data.results.map(toMovie)
}

export async function getPopular() {
  const data = await fetchJson('/movie/popular')
  if (!data || !data.results) return []
  return data.results.map(toMovie)
}

export async function searchMovies(query) {
  if (!query || !query.trim()) return []
  const data = await fetchJson('/search/movie', { query })
  if (!data || !data.results) return []
  const filtered = data.results
    .filter((r) => !!r.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 20)
  return filtered.map(toMovie)
}

export async function searchMulti(query) {
  if (!query || !query.trim()) return []
  const data = await fetchJson('/search/multi', { query })
  if (!data || !data.results) return []
  const filtered = data.results
    .filter((r) => !!r.poster_path && (r.media_type === 'movie' || r.media_type === 'tv'))
    .slice(0, 20)
  return filtered.map(toMovie)
}

export async function getActorCreditIds(actorName) {
  const personData = await fetchJson('/search/person', { query: actorName })
  const actorId = personData?.results?.[0]?.id
  if (!actorId) return new Set()
  const creditsData = await fetchJson(`/person/${actorId}/combined_credits`)
  const castList = Array.isArray(creditsData?.cast) ? creditsData.cast : []
  const ids = castList
    .filter((item) => item?.id && (item.media_type === 'movie' || item.media_type === 'tv'))
    .map((item) => item.id)
  return new Set(ids)
}

export async function getDetails(id, type = 'movie') {
  try {
    const key = getKey()
    if (!key) return null
    const url = `${API_BASE}/${type}/${id}?api_key=${key}`
    const res = await fetch(url)
    if (!res.ok) return null
    const item = await res.json()
    const movie = toMovie(item)
    return {
      ...movie,
      overview: item.overview || '',
      genres: Array.isArray(item.genres) ? item.genres.map((g) => g.name) : [],
      runtime: item.runtime || item.episode_run_time?.[0],
      releaseDate: item.release_date || item.first_air_date,
      media_type: type,
    }
  } catch (err) {
    console.error('API Error:', err)
    return null
  }
}

export async function getTrailer(id, type = 'movie') {
  try {
    const key = getKey()
    if (!key) return null
    const url = `${API_BASE}/${type}/${id}/videos?api_key=${key}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const vids = data?.results || []
    const trailer = vids.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
    if (!trailer) return null
    return `https://www.youtube.com/watch?v=${trailer.key}`
  } catch (err) {
    console.error('API Error:', err)
    return null
  }
}

export function posterUrlFromPath(path) {
  return path ? `${IMG_BASE}${path}` : PLACEHOLDER
}
