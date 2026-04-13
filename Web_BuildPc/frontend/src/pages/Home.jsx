import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCPUs, getGPUs } from '../api/api';

const Home = () => {
  const [topCPUs, setTopCPUs] = useState([]);
  const [topGPUs, setTopGPUs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopComponents = async () => {
      try {
        // Fetch top 5 components by score (API already sorts by score DESC)
        const cpus = await getCPUs('', 5);
        const gpus = await getGPUs('', 5);
        setTopCPUs(cpus);
        setTopGPUs(gpus);
      } catch (error) {
        console.error("Error fetching top components:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopComponents();
  }, []);

  if (loading) return <div className="text-center py-10 text-xl font-semibold">Loading Benchmark Data...</div>;

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-blue-100 sm:text-5xl">
          Welcome to UserBenchClone
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Compare CPUs, GPUs, and build your dream PC with our comprehensive benchmark database.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top CPUs Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Top CPUs by Score</h2>
            <Link to="/cpu" className="text-blue-100 hover:text-white text-sm font-medium">View All &rarr;</Link>
          </div>
          <div className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCPUs.map((cpu, index) => (
                  <tr key={cpu._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">#{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/cpu/${cpu._id}`}>{cpu.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100 text-right font-bold">{cpu.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top GPUs Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Top GPUs by Score</h2>
            <Link to="/gpu" className="text-green-100 hover:text-white text-sm font-medium">View All &rarr;</Link>
          </div>
          <div className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topGPUs.map((gpu, index) => (
                  <tr key={gpu._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">#{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/gpu/${gpu._id}`}>{gpu.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100 text-right font-bold">{gpu.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;