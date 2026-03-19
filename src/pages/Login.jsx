import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background-secondary p-8 rounded-2xl border border-white/5 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img 
              src="/logo.png" 
              alt="CineScope Logo" 
              className="h-16 w-16 object-contain mb-4 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 smooth-transition hover:scale-110"
            />
          </Link>
          <h2 className="font-heading text-3xl text-white text-center">Login to CineScope</h2>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-surface-400 text-xs uppercase mb-2 font-semibold tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-background-primary border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-surface-400 text-xs uppercase mb-2 font-semibold tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background-primary border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent transition-all"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl smooth-transition shadow-lg shadow-yellow-400/10 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-surface-400 text-sm">
          Don't have an account? {' '}
          <Link to="/signup" className="text-yellow-400 hover:underline font-medium">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
