import React from 'react';
import { Link } from 'react-router-dom';

const BenchmarkTable = ({ data, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="ub-card p-10 text-center text-neutral-500 italic text-sm">
        No components found matching criteria.
      </div>
    );
  }

  const isCPU = type === 'cpu';

  // Helper function to dynamically assign color classes based on score
  const getScoreColor = (score) => {
    if (!score) return 'text-neutral-500';
    if (score >= 25000) return 'text-emerald-400'; // Adjust colors based on your Tailwind config
    if (score >= 18000) return 'text-sky-400';
    if (score >= 10000) return 'text-amber-400';
    return 'text-rose-400';
  };

  const TableHeader = ({ children, className = "" }) => (
    <th className={`px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight ${className}`}>
      {children}
    </th>
  );

  return (
    <div className="overflow-x-auto ub-card shadow-xl">
      <table className="min-w-full divide-y divide-neutral-800 table-fixed">
        <thead className="bg-primary-dark">
          <tr>
            <TableHeader className="w-16 pl-6">Rank</TableHeader>
            <TableHeader className="w-1/3 min-w-[250px]">Component Name</TableHeader>
            {isCPU ? (
              <>
                <TableHeader className="w-24 text-right">Cores</TableHeader>
                <TableHeader className="w-24 text-right">Threads</TableHeader>
                <TableHeader className="w-32 text-right">Clock (Boost)</TableHeader>
              </>
            ) : (
              <>
                <TableHeader className="w-28 text-right">VRAM</TableHeader>
                <TableHeader className="w-32 text-right">Clock (Boost)</TableHeader>
              </>
            )}
            <TableHeader className="w-28 text-right">Est. Price</TableHeader>
            <TableHeader className="w-32 text-right pr-6">Bench Score</TableHeader>
          </tr>
        </thead>
        <tbody className="bg-primary-dark divide-y divide-neutral-800/60">
          {data.map((item, index) => (
            <tr key={item._id} className="hover:bg-primary-light/50 transition-colors group">
              
              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500 font-mono font-medium pl-6">
                #{index + 1}
              </td>
              
              <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold truncate group-hover:overflow-visible">
                <Link 
                  to={`/component/${type}/${item._id}`} 
                  className="text-white group-hover:text-accent hover:underline transition-colors"
                >
                  {item.name}
                </Link>
                <span className="text-neutral-600 ml-2 text-xs font-medium uppercase">{item.brand}</span>
              </td>
              
              {isCPU ? (
                <>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-300 text-right">{item.cores}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-300 text-right">{item.threads}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-300 text-right font-mono text-xs">
                    {item.baseClock}GHz <span className='text-neutral-500'>({item.boostClock}GHz)</span>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-300 text-right">{item.vram} GB</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-300 text-right font-mono text-xs">
                    {item.baseClock}MHz <span className='text-neutral-500'>({item.boostClock}MHz)</span>
                  </td>
                </>
              )}
              
              <td className="px-4 py-2 whitespace-nowrap text-sm text-white font-semibold text-right">
                ${item.price}
              </td>
              
              <td className={`px-4 py-2 whitespace-nowrap text-base font-extrabold text-right pr-6 ${getScoreColor(item.score)}`}>
                {item.score ? item.score.toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BenchmarkTable;