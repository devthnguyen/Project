import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 ub-card p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h1>
      
      {error && (
        <div className="bg-rose-950/50 border border-rose-800 text-rose-400 px-4 py-3 rounded-sm mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-primary-dark text-white border border-neutral-700 rounded-sm focus:outline-none focus:border-accent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-primary-dark text-white border border-neutral-700 rounded-sm focus:outline-none focus:border-accent"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-accent py-3 text-lg mt-4 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-neutral-400 text-sm">
        Don't have an account? <Link to="/register" className="text-accent hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;