import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password);
    if (res.success) {
      navigate('/');
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
          <h2 className="font-heading text-3xl text-white text-center">Join CineScope</h2>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-surface-400 text-xs uppercase mb-2 font-semibold tracking-wider">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-background-primary border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-surface-400 text-xs uppercase mb-2 font-semibold tracking-wider">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-background-primary border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent transition-all"
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
          <div>
            <label className="block text-surface-400 text-xs uppercase mb-2 font-semibold tracking-wider">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background-primary border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent transition-all"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-4 rounded-xl smooth-transition shadow-lg shadow-accent/10 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-surface-400 text-sm">
          Already have an account? {' '}
          <Link to="/login" className="text-accent hover:underline font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
