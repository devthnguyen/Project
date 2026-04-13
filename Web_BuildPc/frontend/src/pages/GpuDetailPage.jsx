import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGPUById } from '../api/api';

const GpuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gpu, setGpu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGpu = async () => {
      try {
        const data = await getGPUById(id);
        setGpu(data);
      } catch (err) {
        setError('Failed to load GPU details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGpu();
  }, [id]);

  const handleAddToBuild = () => {
    const currentBuild = JSON.parse(localStorage.getItem('pcBuild')) || {
      cpu: null, gpu: null, motherboard: null, ram: null, psu: null, ssd: null
    };
    currentBuild.gpu = gpu;
    localStorage.setItem('pcBuild', JSON.stringify(currentBuild));
    navigate('/build-pc');
  };

  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        items: [{ name: gpu.name, price: gpu.price }], 
        totalPrice: gpu.price 
      } 
    });
  };

  const handleAddToCart = () => {
    alert(`${gpu.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-20 text-neutral-400">Loading component details...</div>;
  if (error) return <div className="text-center py-20 text-rose-500 font-bold">{error}</div>;
  if (!gpu) return <div className="text-center py-20 text-neutral-400">GPU not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/gpu" className="text-accent hover:underline text-sm font-bold">
        &larr; Back to Graphics Cards
      </Link>

      <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Image Placeholder */}
        <div className="md:w-1/2 bg-neutral-100 flex items-center justify-center p-10 border-r border-neutral-200">
          <div className="w-80 h-32 bg-neutral-800 rounded-md flex items-center justify-center shadow-2xl relative">
             <div className="flex gap-4">
                 <div className="w-16 h-16 rounded-full border-4 border-neutral-600 bg-neutral-700"></div>
                 <div className="w-16 h-16 rounded-full border-4 border-neutral-600 bg-neutral-700"></div>
                 <div className="w-16 h-16 rounded-full border-4 border-neutral-600 bg-neutral-700"></div>
             </div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-black text-neutral-900 mb-2">{gpu.name}</h1>
          <div className="text-4xl font-black text-accent mb-8">${gpu.price}</div>

          <h3 className="text-xl font-bold text-neutral-800 mb-4 border-b border-neutral-200 pb-2">
            Specifications
          </h3>
          
          <ul className="space-y-3 mb-10 text-sm">
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Brand</span>
              <span className="text-neutral-900 font-bold">{gpu.brand || 'N/A'}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">VRAM</span>
              <span className="text-neutral-900 font-bold">{gpu.vram || 'N/A'} GB</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Boost Clock</span>
              <span className="text-neutral-900 font-bold">{gpu.clockSpeed || gpu.boostClock || 'N/A'} MHz</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">TDP</span>
              <span className="text-neutral-900 font-bold">{gpu.tdp || 'N/A'} W</span>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors w-full"
              >
                Add to Build
              </button>
              <button 
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors w-full"
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

export default GpuDetailPage;