import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import Search from './pages/Search.jsx'
import Watchlist from './pages/Watchlist.jsx'
import Profile from './pages/Profile.jsx'
import Favorites from './pages/Favorites.jsx'
import Watched from './pages/Watched.jsx'
import Reviews from './pages/Reviews.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext'
import { Analytics } from '@vercel/analytics/react'

/**
 * CineScope — Main Application Shell
 */
function App() {
  const location = useLocation()
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <img 
            src="/logo.png" 
            alt="CineScope" 
            className="h-20 w-20 object-contain rounded-2xl shadow-2xl shadow-black/60" 
            loading="lazy"
          />
        </motion.div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-yellow-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans">
      <Navbar />

      {/* ── Page Routes with Transitions ── */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/watched" element={<ProtectedRoute><Watched /></ProtectedRoute>} />
              <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Analytics />
    </div>
  )
}

export default App
