import React, { useState } from 'react';

const BuildPCSelector = ({ label, items, selectedId, onSelect, renderDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on the search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-6 bg-primary-dark p-5 rounded-lg border border-neutral-700/60 shadow-md">
      <h3 className="text-lg font-bold text-white mb-3">{label}</h3>
      
      {/* Search Bar */}
      <div className="relative mb-3">
        <input 
          type="text"
          placeholder={`Search ${label}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-primary text-white border border-neutral-600 rounded-md px-4 py-2 pl-10 focus:outline-none focus:border-accent transition-colors"
        />
        <svg className="w-5 h-5 text-neutral-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      {/* Scrollable Component List */}
      <div className="max-h-56 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        <button 
          onClick={() => onSelect('')}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedId === '' ? 'bg-accent text-white font-bold' : 'text-neutral-400 hover:bg-primary-light hover:text-white'}`}
        >
          None
        </button>
        {filteredItems.map(item => (
          <button
            key={item._id}
            onClick={() => onSelect(item._id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${selectedId === item._id ? 'bg-accent text-white font-bold' : 'text-neutral-300 hover:bg-primary-light hover:text-white'}`}
          >
            <span className="truncate pr-4 font-medium">{item.name}</span>
            <span className="whitespace-nowrap opacity-90 font-mono text-xs">
              ${item.price} {renderDetails ? renderDetails(item) : ''}
            </span>
          </button>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-neutral-500 text-sm px-3 py-4 text-center">No components found matching "{searchQuery}".</div>
        )}
      </div>
    </div>
  );
};

export default BuildPCSelector;