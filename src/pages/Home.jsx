import { useEffect, useState } from 'react'
import PosterGrid from '../components/movie/PosterGrid.jsx'
import MovieRow from '../components/movie/MovieRow.jsx'
import ReviewCard from '../components/review/ReviewCard.jsx'
import { motion } from 'framer-motion'
import { getTrending, getPopular } from '../lib/tmdb.js'

const trendingSeed = [
  { id: 1, title: 'The Silent Echo', year: 2024, rating: 4, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Silent+Echo' },
  { id: 2, title: 'Neon Nights', year: 2023, rating: 5, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Neon+Nights' },
  { id: 3, title: 'Lunar Drift', year: 2022, rating: 3, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Lunar+Drift' },
  { id: 4, title: 'Glass Garden', year: 2021, rating: 4, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Glass+Garden' },
  { id: 5, title: 'Crimson Road', year: 2020, rating: 5, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Crimson+Road' },
  { id: 6, title: 'Arcade Dreams', year: 2019, rating: 4, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Arcade+Dreams' },
  { id: 7, title: 'Midnight Sun', year: 2018, rating: 3, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Midnight+Sun' },
  { id: 8, title: 'Iron Veil', year: 2017, rating: 4, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Iron+Veil' },
  { id: 9, title: 'Echo City', year: 2016, rating: 4, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Echo+City' },
  { id: 10, title: 'Blue Ember', year: 2015, rating: 5, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Blue+Ember' },
]

const popularSeed = [
  { id: 11, title: 'Golden Age', year: 2023, rating: 5, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Golden+Age' },
  { id: 12, title: 'Shadow Line', year: 2022, rating: 4, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Shadow+Line' },
  { id: 13, title: 'Digital Hearts', year: 2021, rating: 4, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Digital+Hearts' },
  { id: 14, title: 'Silver Wave', year: 2020, rating: 3, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Silver+Wave' },
  { id: 15, title: 'Obsidian Sky', year: 2019, rating: 5, posterUrl: 'https://placehold.co/400x600/0f0f0f/6c5ce7?text=Obsidian+Sky' },
  { id: 16, title: 'Velvet Storm', year: 2018, rating: 4, posterUrl: 'https://placehold.co/400x600/1a1a1a/6c5ce7?text=Velvet+Storm' },
]

const reviews = [
  { id: 'r1', username: 'Ava Chen', rating: 5, text: 'A stunning cinematic experience with breathtaking visuals.' },
  { id: 'r2', username: 'Liam Patel', rating: 4, text: 'Strong performances and a gripping score elevate the plot.' },
  { id: 'r3', username: 'Noah Kim', rating: 3, text: 'Predictable story, but the direction and pacing keep it engaging.' },
]

function Home() {
  const [trending, setTrending] = useState(trendingSeed)
  const [popular, setPopular] = useState(popularSeed)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [t, p] = await Promise.all([getTrending(), getPopular()])
      if (!alive) return
      if (Array.isArray(t) && t.length) setTrending(t.slice(0, 10))
      if (Array.isArray(p) && p.length) setPopular(p.slice(0, 6))
    })()
    return () => { alive = false }
  }, [])

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
            Discover Your Next Favorite Film
          </h1>
          <p className="mt-3 text-surface-300 max-w-2xl mx-auto">
            Browse trending titles, see what’s popular this week, and dive into reviews from the community.
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
        <PosterGrid movies={trending} />
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
      >
        <MovieRow title="Popular This Week" movies={popular} />
      </motion.section>

      <motion.section
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
      >
        <h2 className="font-heading text-2xl text-white mb-4">Latest Reviews</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} username={r.username} rating={r.rating} text={r.text} />
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Home
