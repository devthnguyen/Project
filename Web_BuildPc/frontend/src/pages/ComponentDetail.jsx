import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCPUById, getGPUById } from '../api/api';
import PerformanceChart from '../components/PerformanceChart';

const ComponentDetail = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComponent = async () => {
      setLoading(true);
      setError('');
      try {
        let data;
        if (type === 'cpu') {
          data = await getCPUById(id);
        } else if (type === 'gpu') {
          data = await getGPUById(id);
        }
        setComponent(data);
      } catch (err) {
        console.error("Error fetching component details:", err);
        setError('Component not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchComponent();
  }, [id, type]);

  if (loading) return <div className="text-center py-10 text-xl">Loading details...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-bold">{error}</div>;
  if (!component) return <div className="text-center py-10">No data available.</div>;

  const isCPU = type === 'cpu';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
      >
        &larr; Back
      </button>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className={`px-6 py-6 ${isCPU ? 'bg-blue-600' : 'bg-green-600'}`}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-white">{component.name}</h1>
            <span className="bg-white text-blue-500 text-lg font-bold px-4 py-1 rounded-full shadow-sm">
              Score: {component.score.toLocaleString()}
            </span>
          </div>
          <p className="text-white opacity-80 mt-1 font-medium">{component.brand} {type.toUpperCase()}</p>
        </div>
        
        <div className="p-6 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-blue-500 mb-4 border-b pb-2">Specifications</h3>
            <dl className="space-y-4">
              {isCPU ? (
                <>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 font-medium">Cores</dt>
                    <dd className="text-blue-500 font-bold">{component.cores}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 font-medium">Threads</dt>
                    <dd className="text-blue-500 font-bold">{component.threads}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 font-medium">Base Clock</dt>
                    <dd className="text-blue-500 font-bold">{component.baseClock} GHz</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 font-medium">Boost Clock</dt>
                    <dd className="text-blue-500 font-bold">{component.boostClock} GHz</dd>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 font-medium">VRAM</dt>
                    <dd className="text-blue-500 font-bold">{component.vram} GB</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 font-medium">Clock Speed</dt>
                    <dd className="text-blue-500 font-bold">{component.clockSpeed} MHz</dd>
                  </div>
                </>
              )}
              <div className="flex justify-between border-t pt-4">
                <dt className="text-gray-500 font-medium">Est. Price</dt>
                <dd className="text-green-600 font-extrabold text-lg">${component.price}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col justify-center">
             <PerformanceChart 
               labels={[component.name]} 
               data={[component.score]} 
               title="Synthetic Performance Score"
               color={isCPU ? 'rgba(37, 99, 235, 0.8)' : 'rgba(22, 163, 74, 0.8)'}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail;