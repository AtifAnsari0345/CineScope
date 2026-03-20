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
  const normalizeMovieData = (movie = {}) => ({
    id: movie?.id,
    title: movie?.title || movie?.name || 'Untitled',
    poster_path: movie?.poster_path || '',
    vote_average: Number(movie?.vote_average ?? movie?.rating ?? 0) || 0,
    media_type: movie?.media_type || 'movie',
    year: movie?.year
  });

  const setIfChanged = (setter, nextValue) => {
    setter((prevValue) => {
      if (JSON.stringify(prevValue) === JSON.stringify(nextValue)) return prevValue;
      return nextValue;
    });
  };

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
      setIfChanged(setWatchlist, res.data.watchlist || []);
      setIfChanged(setFavorites, res.data.favorites || []);
      setIfChanged(setWatched, res.data.watched || []);
      setIfChanged(setUserReviews, res.data.reviews || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    if (!user) return;
    const movieData = normalizeMovieData(movie);
    if (!movieData.id) return;
    const exists = watchlist.some(m => toId(m.movieId) === toId(movieData.id));
    if (exists) return;
    try {
      const res = await axios.post(`${API_URL}/user/watchlist/add`, {
        movieId: movieData.id,
        title: movieData.title,
        poster: movieData.poster_path,
        media_type: movieData.media_type,
        year: movieData.year,
        rating: movieData.vote_average
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIfChanged(setWatchlist, res.data);
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
      setIfChanged(setWatchlist, res.data);
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
      await fetchUserData();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const toggleFavorite = async (movie) => {
    if (!user) return;
    const movieData = normalizeMovieData(movie);
    if (!movieData.id) return;
    const isFav = favorites.some(m => toId(m.movieId) === toId(movieData.id));
    try {
      if (isFav) {
        const res = await axios.delete(`${API_URL}/user/favorites/remove/${movieData.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIfChanged(setFavorites, res.data);
      } else {
        const res = await axios.post(`${API_URL}/user/favorites/add`, {
          movieId: movieData.id,
          title: movieData.title,
          poster: movieData.poster_path,
          media_type: movieData.media_type,
          year: movieData.year,
          rating: movieData.vote_average
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIfChanged(setFavorites, res.data);
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
      await fetchUserData();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const addToWatched = async (movie) => {
    if (!user) return;
    const movieData = normalizeMovieData(movie);
    if (!movieData.id) return;
    const exists = watched.some(m => toId(m.movieId) === toId(movieData.id));
    if (exists) return;
    try {
      const res = await axios.post(`${API_URL}/user/watched/add`, {
        movieId: movieData.id,
        title: movieData.title,
        poster: movieData.poster_path,
        media_type: movieData.media_type,
        year: movieData.year,
        rating: movieData.vote_average
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIfChanged(setWatched, res.data);
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
      setIfChanged(setWatched, res.data);
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
      await fetchUserData();
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
      setIfChanged(setUserReviews, res.data);
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
      setIfChanged(setUserReviews, res.data);
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
