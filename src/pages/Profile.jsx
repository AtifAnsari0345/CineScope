import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/movie/MovieCard.jsx'
import RatingStars from '../components/review/RatingStars.jsx'
import { useWatchlist } from '../context/WatchlistContext.jsx'
import { useAuth } from '../context/AuthContext'
import { posterUrlFromPath } from '../lib/tmdb.js'

function Profile() {
  const { 
    watchlist, 
    removeFromWatchlist, 
    removeMultipleFromWatchlist,
    favorites, 
    toggleFavorite,
    removeMultipleFromFavorites,
    watched, 
    removeFromWatched,
    removeMultipleFromWatched,
    userReviews, 
    deleteReview 
  } = useWatchlist()
  const { user, updateUserProfile, logout } = useAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    bio: ''
  })
  const [selectionMode, setSelectionMode] = useState({
    favorites: false,
    watched: false,
    watchlist: false
  })
  const [selectedIds, setSelectedIds] = useState({
    favorites: [],
    watched: [],
    watchlist: []
  })
  const selectedIdsRef = useRef(selectedIds)

  useEffect(() => {
    selectedIdsRef.current = selectedIds
  }, [selectedIds])

  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.name || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  const avatarDisplay = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundType=gradientLinear`

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    const res = await updateUserProfile({
      name: editForm.username,
      bio: editForm.bio
    })
    if (res.success) {
      setIsEditing(false)
    } else {
      alert(res.message)
    }
  }

  const userStats = useMemo(() => ({
    watched: watched?.length || 0,
    reviews: userReviews?.length || 0,
    favorites: favorites?.length || 0
  }), [watched, userReviews, favorites])

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Helper to map DB movie object to MovieCard expected format
  const mapMovie = (m) => ({
    id: m.movieId,
    title: m.title,
    poster_path: m.poster,
    media_type: m.media_type,
    year: m.year,
    vote_average: m.rating * 2 // back to 10 scale
  })

  const toggleSectionMode = (section) => {
    setSelectionMode((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
    setSelectedIds((prev) => ({
      ...prev,
      [section]: []
    }))
  }

  const toggleSelectedId = (section, movieId) => {
    const id = String(movieId)
    setSelectedIds((prev) => {
      const current = prev[section]
      const exists = current.includes(id)
      return {
        ...prev,
        [section]: exists ? current.filter((item) => item !== id) : [...current, id]
      }
    })
  }

  const handleBulkDelete = async (section) => {
    const ids = [...(selectedIdsRef.current[section] || [])]
    if (!ids?.length) return
    if (section === 'watchlist') await removeMultipleFromWatchlist(ids)
    if (section === 'favorites') await removeMultipleFromFavorites(ids)
    if (section === 'watched') await removeMultipleFromWatched(ids)
    setSelectedIds((prev) => ({ ...prev, [section]: [] }))
    setSelectionMode((prev) => ({ ...prev, [section]: false }))
  }

  const isSelected = (section, movieId) => selectedIds[section].includes(String(movieId))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl sm:text-4xl text-white mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-white/5 bg-background-secondary p-6 smooth-transition sticky top-24">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <img
                    src={avatarDisplay}
                    alt={editForm.username}
                    className="h-16 w-16 rounded-full border-2 border-yellow-400 shadow-lg object-cover"
                  />
                </div>
                <div>
                  <label className="block text-surface-400 text-xs uppercase mb-1 font-semibold tracking-wider">Name</label>
                  <input 
                    type="text" 
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full bg-background-primary border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-surface-400 text-xs uppercase mb-1 font-semibold tracking-wider">Bio</label>
                  <textarea 
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-background-primary border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:ring-1 focus:ring-accent h-24 resize-none transition-all"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 rounded-lg text-sm smooth-transition">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-surface-700 hover:bg-surface-600 text-white py-2 rounded-lg text-sm smooth-transition">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={avatarDisplay}
                      alt={user?.name}
                      className="h-16 w-16 rounded-full border border-white/10 shadow-lg object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white text-xl font-semibold">{user?.name}</div>
                    <div className="text-surface-400 text-sm">Member</div>
                  </div>
                </div>
                <p className="text-surface-300 mt-4 italic leading-relaxed">"{user?.bio}"</p>
                <div className="flex flex-col gap-2 mt-6">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full border border-white/10 hover:bg-white/5 text-surface-300 py-2 rounded-lg text-sm transition-all font-medium"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full border border-red-500/20 hover:bg-red-500/10 text-red-400 py-2 rounded-lg text-sm transition-all font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/5">
              <div className="rounded-lg border border-white/5 bg-background-primary p-3 text-center">
                <div className="text-white text-lg font-semibold">{userStats.watched}</div>
                <div className="text-surface-400 text-[10px] uppercase tracking-tighter font-medium">Watched</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-background-primary p-3 text-center">
                <div className="text-white text-lg font-semibold">{watchlist?.length || 0}</div>
                <div className="text-surface-400 text-[10px] uppercase tracking-tighter font-medium">Watchlist</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-background-primary p-3 text-center">
                <div className="text-white text-lg font-semibold">{userStats.favorites}</div>
                <div className="text-surface-400 text-[10px] uppercase tracking-tighter font-medium">Favourites</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Favorites Preview */}
          <div className="rounded-xl border border-white/5 bg-background-secondary p-6 smooth-transition">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-white">My Favourites</h2>
              <div className="flex items-center gap-2">
                {selectionMode.favorites ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleBulkDelete('favorites')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                      disabled={selectedIds.favorites.length === 0}
                    >
                      Delete ({selectedIds.favorites.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSectionMode('favorites')}
                      className="px-3 py-1.5 rounded-lg border border-white/15 text-surface-300 text-xs font-semibold hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSectionMode('favorites')}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all"
                    >
                      Remove
                    </button>
                    <Link to="/favorites" className="text-yellow-400 text-sm hover:underline font-medium flex items-center gap-1">
                      See All 
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {favorites?.length === 0 ? (
              <div className="text-surface-400 text-center py-10 bg-background-primary/20 rounded-xl border border-dashed border-white/5">
                No favourites yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favorites?.slice(0, 4).map((movie) => (
                  <div key={movie.movieId} className={`relative ${selectionMode.favorites && isSelected('favorites', movie.movieId) ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                    <MovieCard 
                      movie={mapMovie(movie)} 
                      onRemove={selectionMode.favorites ? undefined : () => toggleFavorite(mapMovie(movie))}
                    />
                    {selectionMode.favorites && (
                      <button
                        type="button"
                        onClick={() => toggleSelectedId('favorites', movie.movieId)}
                        className="absolute inset-0 z-20 rounded-xl bg-black/40 border border-white/15 flex items-start justify-end p-2"
                      >
                        <span className={`h-6 w-6 rounded-md border text-xs font-bold inline-flex items-center justify-center ${isSelected('favorites', movie.movieId) ? 'bg-red-600 border-red-500 text-white' : 'bg-black/60 border-white/30 text-white'}`}>
                          {isSelected('favorites', movie.movieId) ? '✓' : ''}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Watched Preview */}
          <div className="rounded-xl border border-white/5 bg-background-secondary p-6 smooth-transition">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-white">Watched</h2>
              <div className="flex items-center gap-2">
                {selectionMode.watched ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleBulkDelete('watched')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                      disabled={selectedIds.watched.length === 0}
                    >
                      Delete ({selectedIds.watched.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSectionMode('watched')}
                      className="px-3 py-1.5 rounded-lg border border-white/15 text-surface-300 text-xs font-semibold hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSectionMode('watched')}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all"
                    >
                      Remove
                    </button>
                    <Link to="/watched" className="text-yellow-400 text-sm hover:underline font-medium flex items-center gap-1">
                      See All 
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {watched?.length === 0 ? (
              <div className="text-surface-400 text-center py-10 bg-background-primary/20 rounded-xl border border-dashed border-white/5">
                No watched items yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {watched?.slice(0, 4).map((movie) => (
                  <div key={movie.movieId} className={`relative ${selectionMode.watched && isSelected('watched', movie.movieId) ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                    <MovieCard 
                      movie={mapMovie(movie)} 
                      onRemove={selectionMode.watched ? undefined : () => removeFromWatched(movie.movieId)}
                    />
                    {selectionMode.watched && (
                      <button
                        type="button"
                        onClick={() => toggleSelectedId('watched', movie.movieId)}
                        className="absolute inset-0 z-20 rounded-xl bg-black/40 border border-white/15 flex items-start justify-end p-2"
                      >
                        <span className={`h-6 w-6 rounded-md border text-xs font-bold inline-flex items-center justify-center ${isSelected('watched', movie.movieId) ? 'bg-red-600 border-red-500 text-white' : 'bg-black/60 border-white/30 text-white'}`}>
                          {isSelected('watched', movie.movieId) ? '✓' : ''}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Watchlist Preview */}
          <div className="rounded-xl border border-white/5 bg-background-secondary p-6 smooth-transition">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-white">Watchlist</h2>
              <div className="flex items-center gap-2">
                {selectionMode.watchlist ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleBulkDelete('watchlist')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                      disabled={selectedIds.watchlist.length === 0}
                    >
                      Delete ({selectedIds.watchlist.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSectionMode('watchlist')}
                      className="px-3 py-1.5 rounded-lg border border-white/15 text-surface-300 text-xs font-semibold hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSectionMode('watchlist')}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-all"
                    >
                      Remove
                    </button>
                    <Link to="/watchlist" className="text-yellow-400 text-sm hover:underline font-medium flex items-center gap-1">
                      See All 
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {watchlist?.length === 0 ? (
              <div className="text-surface-400 text-center py-10 bg-background-primary/20 rounded-xl border border-dashed border-white/5">
                Watchlist is empty.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {watchlist?.slice(0, 4).map((movie) => (
                  <div key={movie.movieId} className={`relative ${selectionMode.watchlist && isSelected('watchlist', movie.movieId) ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                    <MovieCard 
                      movie={mapMovie(movie)} 
                      onRemove={selectionMode.watchlist ? undefined : () => removeFromWatchlist(movie.movieId)}
                    />
                    {selectionMode.watchlist && (
                      <button
                        type="button"
                        onClick={() => toggleSelectedId('watchlist', movie.movieId)}
                        className="absolute inset-0 z-20 rounded-xl bg-black/40 border border-white/15 flex items-start justify-end p-2"
                      >
                        <span className={`h-6 w-6 rounded-md border text-xs font-bold inline-flex items-center justify-center ${isSelected('watchlist', movie.movieId) ? 'bg-red-600 border-red-500 text-white' : 'bg-black/60 border-white/30 text-white'}`}>
                          {isSelected('watchlist', movie.movieId) ? '✓' : ''}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Preview */}
          <div className="rounded-xl border border-white/5 bg-background-secondary p-6 smooth-transition">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-white">My Reviews</h2>
              <Link to="/reviews" className="text-yellow-400 text-sm hover:underline font-medium flex items-center gap-1">
                See All 
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            {userReviews?.length === 0 ? (
              <div className="text-surface-300 text-center py-12 bg-background-primary/30 rounded-2xl border border-dashed border-white/10">
                You haven't written any reviews yet.
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews?.slice(0, 2).map((review) => (
                  <div key={review._id} className="bg-background-primary p-4 rounded-xl border border-white/5 flex gap-4 group hover:border-white/10 transition-all">
                    <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/5 shadow-lg">
                      <img 
                        src={posterUrlFromPath(review.moviePoster)} 
                        alt={review.movieTitle} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="text-white font-semibold text-base truncate">{review.movieTitle}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <RatingStars value={review.rating} readOnly size={12} />
                            <span className="text-surface-500 text-[10px] uppercase tracking-wider">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteReview(review._id)}
                          className="text-surface-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                          title="Delete Review"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                      <p className="text-surface-300 text-xs mt-2 line-clamp-2 italic leading-relaxed">"{review.reviewText}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
