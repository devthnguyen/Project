import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../api/api'; // Make sure this includes the JWT auth headers as defined in api.js

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve build/cart data passed from React Router state
  const { items, totalPrice } = location.state || { items: [], totalPrice: 0 };

  useEffect(() => {
    if (!user) {
      alert("Please log in to complete your purchase.");
      navigate('/login');
    }
    if (items.length === 0) {
      navigate('/build-pc');
    }
  }, [user, items, navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) return setError('Please enter a valid shipping address');
    
    setLoading(true);
    setError('');

    try {
      // Create the payload expected by your backend Order model
      const orderPayload = {
        items: items.map(item => ({ name: item.name, price: item.price })),
        totalPrice: totalPrice,
        address: address
      };

      await createOrder(orderPayload); // Contains the POST /api/orders call
      
      // On success, clear the local storage build (optional, but good UX)
      localStorage.removeItem('pcBuild');
      navigate('/orders');
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (!user || items.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="ub-card p-6 shadow-xl border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-neutral-700/80 pb-2">Order Summary</h2>
          <ul className="space-y-3 mb-6">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span className="text-neutral-300 pr-4">{item.name}</span>
                <span className="text-white font-bold whitespace-nowrap">${item.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center pt-4 border-t border-neutral-700/80">
            <span className="text-lg font-bold text-neutral-300">Total</span>
            <span className="text-3xl font-black text-orange-500">${totalPrice}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="ub-card p-6 shadow-xl border border-neutral-800">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-neutral-700/80 pb-2">Shipping Details</h2>
          
          {error && <p className="text-rose-400 bg-rose-950/50 border border-rose-800 px-4 py-2 rounded-md mb-4 text-sm font-medium">{error}</p>}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Full Shipping Address</label>
              <textarea 
                required
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                className="w-full px-4 py-3 bg-primary text-white border border-neutral-700 rounded-md focus:outline-none focus:border-accent resize-none transition-colors"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-lg mt-4 rounded-lg shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing Payment...' : 'Confirm Order & Pay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;