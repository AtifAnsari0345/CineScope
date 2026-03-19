import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { user, token } = useAuth();

  const toId = (value) => String(value);

  useEffect(() => {
    if (user && token) {
      fetchUserData();
    } else {
      setWatchlist([]);
      setFavorites([]);
      setWatched([]);
      setUserReviews([]);
    }
  }, [user, token]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(res.data.watchlist || []);
      setFavorites(res.data.favorites || []);
      setWatched(res.data.watched || []);
      setUserReviews(res.data.reviews || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    if (!user) return;
    const exists = watchlist.some(m => toId(m.movieId) === toId(movie?.id));
    if (exists) return;
    try {
      const res = await axios.post(`${API_URL}/user/watchlist/add`, {
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        media_type: movie.media_type,
        year: movie.year,
        rating: movie.vote_average
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(res.data);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!user) return;
    try {
      const res = await axios.delete(`${API_URL}/user/watchlist/remove/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(res.data);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const removeMultipleFromWatchlist = async (movieIds = []) => {
    if (!user || movieIds.length === 0) return;
    try {
      await Promise.all(
        movieIds.map((movieId) =>
          axios.delete(`${API_URL}/user/watchlist/remove/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      const idSet = new Set(movieIds.map(toId));
      setWatchlist((prev) => prev.filter((m) => !idSet.has(toId(m.movieId))));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const toggleFavorite = async (movie) => {
    if (!user) return;
    const isFav = favorites.some(m => toId(m.movieId) === toId(movie?.id));
    try {
      if (isFav) {
        const res = await axios.delete(`${API_URL}/user/favorites/remove/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } else {
        const res = await axios.post(`${API_URL}/user/favorites/add`, {
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          media_type: movie.media_type,
          year: movie.year,
          rating: movie.vote_average
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const removeMultipleFromFavorites = async (movieIds = []) => {
    if (!user || movieIds.length === 0) return;
    try {
      await Promise.all(
        movieIds.map((movieId) =>
          axios.delete(`${API_URL}/user/favorites/remove/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      const idSet = new Set(movieIds.map(toId));
      setFavorites((prev) => prev.filter((m) => !idSet.has(toId(m.movieId))));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const addToWatched = async (movie) => {
    if (!user) return;
    const exists = watched.some(m => toId(m.movieId) === toId(movie?.id));
    if (exists) return;
    try {
      const res = await axios.post(`${API_URL}/user/watched/add`, {
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        media_type: movie.media_type,
        year: movie.year,
        rating: movie.vote_average
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatched(res.data);
    } catch (error) {
      console.error('Error adding to watched:', error);
    }
  };

  const removeFromWatched = async (movieId) => {
    if (!user) return;
    try {
      const res = await axios.delete(`${API_URL}/user/watched/remove/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatched(res.data);
    } catch (error) {
      console.error('Error removing from watched:', error);
    }
  };

  const removeMultipleFromWatched = async (movieIds = []) => {
    if (!user || movieIds.length === 0) return;
    try {
      await Promise.all(
        movieIds.map((movieId) =>
          axios.delete(`${API_URL}/user/watched/remove/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      const idSet = new Set(movieIds.map(toId));
      setWatched((prev) => prev.filter((m) => !idSet.has(toId(m.movieId))));
    } catch (error) {
      console.error('Error removing from watched:', error);
    }
  };

  const addReview = async (reviewData) => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_URL}/user/review/add`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserReviews(res.data);
      return { success: true };
    } catch (error) {
      console.error('Error adding review:', error);
      return { success: false };
    }
  };

  const deleteReview = async (reviewId) => {
    if (!user) return;
    try {
      const res = await axios.delete(`${API_URL}/user/review/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserReviews(res.data);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      favorites, 
      watched, 
      userReviews,
      loading,
      addToWatchlist, 
      removeFromWatchlist,
      removeMultipleFromWatchlist,
      toggleFavorite,
      removeMultipleFromFavorites,
      addToWatched,
      removeFromWatched,
      removeMultipleFromWatched,
      addReview,
      deleteReview
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};
