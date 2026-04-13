import React, { useState, useEffect } from 'react';
import { getCPUs } from '../api/api';
import BenchmarkTable from "../components/BenchmarkTable";
import SearchBar from '../components/SearchBar';

const CPUPage = () => {
  const [cpus, setCpus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search effect
  useEffect(() => {
    const fetchCPUs = async () => {
      setLoading(true);
      try {
        const data = await getCPUs(searchTerm);
        setCpus(data);
      } catch (error) {
        console.error("Failed to fetch CPUs", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCPUs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-100">CPU Benchmark Ranking</h1>
        <p className="mt-2 text-gray-600">Compare processor performance based on synthetic benchmarks.</p>
      </div>
      
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        placeholder="Search for a CPU (e.g., Ryzen 5 5600)..." 
      />

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading CPUs...</div>
      ) : (
        <BenchmarkTable data={cpus} type="cpu" />
      )}
    </div>
  );
};

export default CPUPage;