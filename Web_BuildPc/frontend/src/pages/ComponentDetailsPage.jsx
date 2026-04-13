import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const API_URL = 'http://localhost:5000/api';

const ComponentDetailsPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        setLoading(true);
        // Map 'motherboard' to 'motherboards' if your backend still uses the plural route
        const endpointType = type === 'motherboard' ? 'motherboards' : type;
        
        // Fetch using the dynamic route
        const response = await axios.get(`${API_URL}/${endpointType}/${id}`);
        setComponent(response.data);
      } catch (err) {
        setError(`Failed to load ${type.toUpperCase()} details.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComponent();
  }, [type, id]);

  const handleAddToBuild = () => {
    const currentBuild = JSON.parse(localStorage.getItem('pcBuild')) || {
      cpu: null, gpu: null, motherboard: null, ram: null, psu: null, ssd: null
    };
    
    // Dynamically assign the component to its correct slot based on the URL parameter
    currentBuild[type] = component;
    localStorage.setItem('pcBuild', JSON.stringify(currentBuild));
    navigate('/build-pc');
  };

  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        items: [{ name: component.name, price: component.price }], 
        totalPrice: component.price 
      } 
    });
  };

  const handleAddToCart = () => {
    // Placeholder for global cart context/state
    alert(`${component.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-20 text-neutral-400">Loading component details...</div>;
  if (error) return <div className="text-center py-20 text-rose-500 font-bold">{error}</div>;
  if (!component) return <div className="text-center py-20 text-neutral-400">Component not found.</div>;

  // Dynamically generate the specifications list
  // Exclude internal DB fields and standard display fields
  const excludeKeys = ['_id', '__v', 'name', 'price', 'brand', 'createdAt', 'updatedAt', 'score'];
  const specs = Object.entries(component).filter(([key]) => !excludeKeys.includes(key));

  // Now it will show the chart for ANY component as long as it has a score
  const showChart = component.score && component.score > 0;
  const chartData = [{ name: component.name, score: component.score }];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link to={`/${type}`} className="text-accent hover:underline text-sm font-bold uppercase tracking-wider">
        &larr; Back to {type}s
      </Link>

      {/* TOP SECTION: Details & Actions */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-neutral-100 flex items-center justify-center p-10 border-r border-neutral-200">
          <div className="w-48 h-48 bg-neutral-300 rounded-md flex items-center justify-center shadow-inner border-2 border-neutral-400">
             <div className="text-neutral-500 font-black text-2xl uppercase tracking-widest">
               {component.brand || type}
             </div>
          </div>
        </div>

        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-black text-neutral-900 mb-2">{component.name}</h1>
          <div className="text-4xl font-black text-accent mb-6">${component.price}</div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={handleBuyNow} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-bold shadow-md transition-colors w-full">
              Buy Now
            </button>
            <button onClick={handleAddToBuild} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold shadow-md transition-colors w-full">
              Add to Build
            </button>
            <button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold shadow-md transition-colors w-full">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Dynamic Specs Table */}
      <div className="bg-primary-dark rounded-lg p-6 shadow-xl border border-neutral-800">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-neutral-700 pb-2">
          Technical Specifications
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
          {specs.map(([key, value]) => (
            <div key={key} className="flex justify-between items-center border-b border-neutral-800/50 pb-2">
              <span className="text-neutral-400 font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-white font-bold text-right">
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
              </span>
            </div>
          ))}
          {specs.length === 0 && <p className="text-neutral-500">No additional specifications available.</p>}
        </div>
      </div>

      {/* BOTTOM SECTION: Benchmark Chart (Recharts) */}
      <div className="bg-primary-dark rounded-lg p-6 shadow-xl border border-neutral-800">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-neutral-700 pb-2">
          Benchmark Performance
        </h3>
        {showChart ? (
          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} />
                <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={100} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center border border-dashed border-neutral-700 rounded-md bg-neutral-900/50 mt-4">
            <p className="text-neutral-500 font-medium">No benchmark data available for this component type.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentDetailsPage;