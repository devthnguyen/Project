import React, { useState, useEffect } from 'react';
import { getCPUs, getGPUs } from '../api/api';
import CompareTable from '../components/CompareTable';
import PerformanceChart from '../components/PerformanceChart';

const ComparePage = () => {
  const [type, setType] = useState('cpu'); // 'cpu' or 'gpu'
  const [items, setItems] = useState([]);
  
  const [item1Id, setItem1Id] = useState('');
  const [item2Id, setItem2Id] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top 100 to populate dropdowns quickly without advanced search for this demo
        const data = type === 'cpu' ? await getCPUs('', 100) : await getGPUs('', 100);
        setItems(data);
        if (data.length >= 2) {
          setItem1Id(data[0]._id);
          setItem2Id(data[1]._id);
        }
      } catch (err) {
        console.error("Error fetching items for comparison", err);
      }
    };
    fetchData();
  }, [type]);

  const item1 = items.find(i => i._id === item1Id);
  const item2 = items.find(i => i._id === item2Id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-100">Compare Components</h1>
        <p className="mt-2 text-gray-600">Select two components to see a side-by-side performance and spec comparison.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Component Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="cpu">Processors (CPU)</option>
              <option value="gpu">Graphics Cards (GPU)</option>
            </select>
          </div>
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Item 1</label>
            <select 
              value={item1Id} 
              onChange={(e) => setItem1Id(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {items.map(item => (
                <option key={`1-${item._id}`} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Item 2</label>
            <select 
              value={item2Id} 
              onChange={(e) => setItem2Id(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              {items.map(item => (
                <option key={`2-${item._id}`} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        {item1 && item2 && (
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <CompareTable item1={item1} item2={item2} type={type} />
            
            <div className="mt-6">
              <PerformanceChart 
                labels={[item1.name, item2.name]} 
                data={[item1.score, item2.score]} 
                title="Performance Comparison"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;