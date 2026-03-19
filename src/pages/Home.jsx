import { useEffect, useState } from 'react'
import PosterGrid from '../components/movie/PosterGrid.jsx'
import MovieRow from '../components/movie/MovieRow.jsx'
import Footer from '../components/layout/Footer.jsx'
import { motion } from 'framer-motion'
import { getTrending, getPopular } from '../lib/tmdb.js'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx'
import { useAuth } from '../context/AuthContext'

function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [t, p] = await Promise.all([getTrending(), getPopular()]);
        setTrending(t || []);
        setPopular(p || []);
      } catch (error) {
        console.error(error);
        setTrending([]);
        setPopular([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="min-h-screen">
      <motion.section
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: 'radial-gradient(1200px 400px at 50% -10%, rgba(212,175,55,0.15), transparent 60%)'
             }} />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white">
            Discover Your Next Favourite Film
          </h1>
          <p className="mt-3 text-surface-300 max-w-2xl mx-auto">
            Experience cinema like never before. Track your journey, discover trending masterpieces, and build your ultimate personal library.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
      >
        <h2 className="font-heading text-2xl text-white mb-4">Trending Movies</h2>
        {loading ? (
          <LoadingSkeleton count={10} />
        ) : trending.length > 0 ? (
          <PosterGrid movies={trending} />
        ) : (
          <p className="text-center text-gray-400">No movies found</p>
        )}
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
      >
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : popular.length > 0 ? (
          <MovieRow title="Popular This Week" movies={popular} />
        ) : (
          <p className="text-center text-gray-400">No movies found</p>
        )}
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 py-16"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-400/20 to-transparent border border-white/5 p-12 text-center group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h2 className="relative font-heading text-4xl sm:text-5xl text-white mb-4">
            Track Every Film.
          </h2>
          <p className="relative text-surface-300 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
            Create your personal watchlist, keep track of movies you've seen, and find your next favourite cinematic masterpiece.
          </p>
          {!user && (
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="px-10 py-4 rounded-2xl bg-yellow-400 text-black font-black tracking-widest uppercase hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-400/20">
                Get Started
              </Link>
              <Link to="/login" className="px-10 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}



export default Home
