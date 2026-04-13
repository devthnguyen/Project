import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSSDs } from '../api/api';
import SearchBar from '../components/SearchBar';

const SsdPage = () => {
  const [ssds, setSsds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('price-desc');

  useEffect(() => {
    const fetchSSDs = async () => {
      setLoading(true);
      try {
        const data = await getSSDs(searchTerm);
        let sortedData = [...data];
        if (sortOrder === 'price-asc') sortedData.sort((a, b) => a.price - b.price);
        if (sortOrder === 'price-desc') sortedData.sort((a, b) => b.price - a.price);
        setSsds(sortedData);
      } catch (error) {
        console.error("Failed to fetch SSDs", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSSDs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, sortOrder]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Storage (SSD) Database</h1>
        <p className="mt-2 text-neutral-400">Find fast and reliable storage for your operating system and games.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="Search for an SSD (e.g., NVMe, 1TB)..." 
        />
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-primary-dark text-neutral-200 border border-neutral-700/80 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-accent w-full sm:w-auto"
        >
          <option value="price-desc">Sort by Price: High to Low</option>
          <option value="price-asc">Sort by Price: Low to High</option>
        </select>
      </div>

      {loading ? (
        <div className="py-10 text-center text-neutral-500">Loading SSDs...</div>
      ) : (
        <div className="overflow-x-auto ub-card shadow-xl">
          <table className="min-w-full divide-y divide-neutral-800 table-fixed">
            <thead className="bg-primary-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight w-1/3">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">Capacity</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">Speeds (R/W)</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-neutral-400 uppercase tracking-tight pr-6">Price</th>
              </tr>
            </thead>
            <tbody className="bg-primary-dark divide-y divide-neutral-800/60">
              {ssds.map((item) => (
                <tr key={item._id} className="hover:bg-primary-light/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {/* CRITICAL FIX: Universal detail page route */}
                    <Link to={`/component/ssd/${item._id}`} className="text-white hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300 font-bold text-accent">{item.capacity} GB</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{item.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-300">{item.readSpeed} / {item.writeSpeed} MB/s</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-semibold text-right pr-6">${item.price}</td>
                </tr>
              ))}
              {ssds.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">No SSDs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SsdPage;