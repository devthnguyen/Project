import React, { useState, useEffect } from 'react';
import { getGPUs } from '../api/api';
import BenchmarkTable from '../components/BenchmarkTable';
import SearchBar from '../components/SearchBar';

const GPUPage = () => {
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search effect
  useEffect(() => {
    const fetchGPUs = async () => {
      setLoading(true);
      try {
        const data = await getGPUs(searchTerm);
        setGpus(data);
      } catch (error) {
        console.error("Failed to fetch GPUs", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchGPUs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-100">GPU Benchmark Ranking</h1>
        <p className="mt-2 text-gray-600">Compare graphics card performance based on synthetic benchmarks.</p>
      </div>
      
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        placeholder="Search for a GPU (e.g., RTX 4070)..." 
      />

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading GPUs...</div>
      ) : (
        <BenchmarkTable data={gpus} type="gpu" />
      )}
    </div>
  );
};

export default GPUPage;