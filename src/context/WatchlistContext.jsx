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

  const toggleFavorite = async (movie) => {
    if (!user) return;
    const isFav = favorites.some(m => String(m.movieId) === String(movie.id));
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

  const addToWatched = async (movie) => {
    if (!user) return;
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
      toggleFavorite,
      addToWatched,
      addReview,
      deleteReview
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};
