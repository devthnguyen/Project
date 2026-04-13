import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCPUById } from '../api/api';

const CpuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cpu, setCpu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCpu = async () => {
      try {
        const data = await getCPUById(id);
        setCpu(data);
      } catch (err) {
        setError('Failed to load CPU details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCpu();
  }, [id]);

  const handleAddToBuild = () => {
    // 1. Load current build or initialize empty structure
    const currentBuild = JSON.parse(localStorage.getItem('pcBuild')) || {
      cpu: null, gpu: null, motherboard: null, ram: null, psu: null, ssd: null
    };
    // 2. Insert component into correct slot
    currentBuild.cpu = cpu;
    // 3. Save back to localStorage
    localStorage.setItem('pcBuild', JSON.stringify(currentBuild));
    // 4. Redirect to builder
    navigate('/build-pc');
  };

  const handleBuyNow = () => {
    // Redirect directly to checkout with a temporary cart
    navigate('/checkout', { 
      state: { 
        items: [{ name: cpu.name, price: cpu.price }], 
        totalPrice: cpu.price 
      } 
    });
  };

  const handleAddToCart = () => {
    // Placeholder for future global cart state
    alert(`${cpu.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-20 text-neutral-400">Loading component details...</div>;
  if (error) return <div className="text-center py-20 text-rose-500 font-bold">{error}</div>;
  if (!cpu) return <div className="text-center py-20 text-neutral-400">CPU not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/cpu" className="text-accent hover:underline text-sm font-bold">
        &larr; Back to Processors
      </Link>

      <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Image Placeholder */}
        <div className="md:w-1/2 bg-neutral-100 flex items-center justify-center p-10 border-r border-neutral-200">
          <div className="w-64 h-64 bg-neutral-300 rounded-md flex items-center justify-center shadow-inner relative border-2 border-neutral-400">
             <div className="text-neutral-500 font-black text-2xl uppercase">{cpu.brand}</div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-black text-neutral-900 mb-2">{cpu.name}</h1>
          <div className="text-4xl font-black text-accent mb-8">${cpu.price}</div>

          <h3 className="text-xl font-bold text-neutral-800 mb-4 border-b border-neutral-200 pb-2">
            Specifications
          </h3>
          
          <ul className="space-y-3 mb-10 text-sm">
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Socket</span>
              <span className="text-neutral-900 font-bold">{cpu.socket || 'N/A'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Cores / Threads</span>
              <span className="text-neutral-900 font-bold">{cpu.cores}C / {cpu.threads}T</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Base Clock</span>
              <span className="text-neutral-900 font-bold">{cpu.baseClock} GHz</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">TDP</span>
              <span className="text-neutral-900 font-bold">{cpu.tdp || 'N/A'} W</span>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={handleBuyNow}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors w-full"
            >
              Buy Now
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleAddToBuild}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors"
              >
                Add to Build
              </button>
              <button 
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CpuDetailPage;