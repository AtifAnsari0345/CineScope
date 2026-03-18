import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePWA } from '../../hooks/usePWA'

function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isInstallable, installApp } = usePWA()
  const linkBase =
    'smooth-transition px-3 py-2 rounded-md text-sm font-medium text-surface-300 hover:text-white hover:bg-background-secondary'
  const activeClass =
    'text-accent bg-background-secondary'

  return (
    <header className="sticky top-0 z-40 bg-background-primary/80 backdrop-blur border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="CineScope Logo" 
              className="h-8 w-8 object-contain rounded-xl overflow-hidden shadow-lg shadow-black/40 smooth-transition group-hover:scale-110"
            />
            <span className="font-accent text-2xl tracking-wide text-accent smooth-transition hover:text-accent-hover">
              CineScope
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {isInstallable && (
              <button
                onClick={installApp}
                className="flex items-center gap-2 px-4 py-2 mr-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:brightness-110 active:scale-95 smooth-transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Install App
              </button>
            )}
            {user ? (
              <>
                <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ''}`}>
                  Home
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ''}`}>
                  Search
                </NavLink>
                <NavLink to="/watchlist" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ''}`}>
                  Watchlist
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ''}`}>
                  Profile
                </NavLink>
                <button 
                  onClick={logout}
                  className="smooth-transition px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ''}`}>
                  Login
                </NavLink>
                <NavLink to="/signup" className="smooth-transition px-4 py-2 rounded-lg text-sm font-bold bg-accent text-black hover:bg-accent-hover ml-2">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-surface-300 hover:text-white hover:bg-background-secondary border border-white/10 smooth-transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M3.75 6.75h16.5v1.5H3.75zM3.75 11.25h16.5v1.5H3.75zM3.75 15.75h16.5v1.5H3.75z" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="sm:hidden py-4 space-y-2 px-4 border-t border-white/5 bg-background-primary/95 backdrop-blur-xl">
            {isInstallable && (
              <button
                onClick={() => { installApp(); setOpen(false); }}
                className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20 active:scale-[0.98] smooth-transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Install CineScope
              </button>
            )}
            {user ? (
              <>
                <NavLink to="/" end onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ''}`}>
                  Home
                </NavLink>
                <NavLink to="/search" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ''}`}>
                  Search
                </NavLink>
                <NavLink to="/watchlist" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ''}`}>
                  Watchlist
                </NavLink>
                <NavLink to="/profile" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ''}`}>
                  Profile
                </NavLink>
                <button 
                  onClick={() => { logout(); setOpen(false); }}
                  className="smooth-transition px-3 py-2 rounded-md text-sm font-medium text-red-400 block w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ''}`}>
                  Login
                </NavLink>
                <NavLink to="/signup" onClick={() => setOpen(false)} className="smooth-transition px-3 py-2 rounded-md text-sm font-bold text-accent block">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
