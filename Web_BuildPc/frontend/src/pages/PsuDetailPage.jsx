import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPSUById } from '../api/api';

const PsuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [psu, setPsu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPsu = async () => {
      try {
        const data = await getPSUById(id);
        setPsu(data);
      } catch (err) {
        setError('Failed to load PSU details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPsu();
  }, [id]);

  const handleAddToBuild = () => {
    const currentBuild = JSON.parse(localStorage.getItem('pcBuild')) || {
      cpu: null, gpu: null, motherboard: null, ram: null, psu: null, ssd: null
    };
    currentBuild.psu = psu;
    localStorage.setItem('pcBuild', JSON.stringify(currentBuild));
    navigate('/build-pc');
  };

  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        items: [{ name: psu.name, price: psu.price }], 
        totalPrice: psu.price 
      } 
    });
  };

  const handleAddToCart = () => {
    alert(`${psu.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-20 text-neutral-400">Loading component details...</div>;
  if (error) return <div className="text-center py-20 text-rose-500 font-bold">{error}</div>;
  if (!psu) return <div className="text-center py-20 text-neutral-400">Power Supply not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/psu" className="text-accent hover:underline text-sm font-bold">
        &larr; Back to Power Supplies
      </Link>

      <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-neutral-100 flex items-center justify-center p-10 border-r border-neutral-200">
          <div className="w-64 h-56 bg-neutral-800 rounded-md flex items-center justify-center shadow-2xl relative border-4 border-neutral-700">
             <div className="text-neutral-500 font-black text-2xl uppercase">{psu.wattage}W</div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-black text-neutral-900 mb-2">{psu.name}</h1>
          <div className="text-4xl font-black text-accent mb-8">${psu.price}</div>

          <h3 className="text-xl font-bold text-neutral-800 mb-4 border-b border-neutral-200 pb-2">
            Specifications
          </h3>
          
          <ul className="space-y-3 mb-10 text-sm">
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Wattage</span>
              <span className="text-neutral-900 font-bold">{psu.wattage} W</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Efficiency Rating</span>
              <span className="text-neutral-900 font-bold">{psu.efficiency}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-500 font-medium">Modular</span>
              <span className="text-neutral-900 font-bold">{psu.modular ? 'Yes' : 'No'}</span>
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

export default PsuDetailPage;