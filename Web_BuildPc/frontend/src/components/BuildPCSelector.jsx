import React from 'react';

const BuildPCSelector = ({ label, items, selectedId, onSelect, renderDetails }) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-bold text-neutral-300 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="block w-full pl-3 pr-10 py-3 text-sm bg-primary-dark text-white border border-neutral-700/80 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent rounded-sm shadow-inner transition-colors"
      >
        <option value="">-- Select {label} --</option>
        {items.map(item => (
          <option key={item._id} value={item._id}>
            {item.name} | ${item.price} {renderDetails ? renderDetails(item) : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BuildPCSelector;