import React from 'react';

const ComponentTable = ({ data, type, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-neutral-500">No components found for this category.</div>;
  }

  // 1. Strictly define columns based on the active tab
  const baseFields = ['name', 'brand'];
  let specificFields = [];

  switch (type) {
    case 'cpu':
      specificFields = ['socket', 'cores', 'threads', 'baseClock', 'boostClock', 'tdp'];
      break;
    case 'gpu':
      specificFields = ['vram', 'baseClock', 'boostClock', 'tdp'];
      break;
    case 'motherboard':
      specificFields = ['socket', 'chipset', 'ramType', 'maxRam'];
      break;
    case 'ram':
      specificFields = ['capacity', 'speed', 'type'];
      break;
    case 'psu':
      specificFields = ['wattage', 'efficiency', 'modular'];
      break;
    case 'ssd':
      specificFields = ['capacity', 'type', 'readSpeed', 'writeSpeed'];
      break;
    default:
      break;
  }

  // Append price and score to the very end of every table
  const headers = [...baseFields, ...specificFields, 'price', 'score'];

  return (
    <div className="overflow-x-auto ub-card shadow-xl">
      <table className="min-w-full divide-y divide-neutral-800 table-auto">
        <thead className="bg-primary-dark">
          <tr>
            {headers.map(header => (
              <th key={header} className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">
                {/* Format camelCase (e.g., 'readSpeed' -> 'Read Speed') */}
                {header.replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-bold text-neutral-400 uppercase tracking-tight">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-primary-dark divide-y divide-neutral-800/60">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-primary-light/30 transition-colors">
              {headers.map(header => {
                let cellValue = item[header];
                
                // Format booleans and missing data
                if (typeof cellValue === 'boolean') {
                  cellValue = cellValue ? 'Yes' : 'No';
                } else if (cellValue === undefined || cellValue === null || cellValue === '') {
                  cellValue = <span className="text-neutral-600 italic">N/A</span>;
                }

                return (
                  <td key={`${item._id}-${header}`} className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                    {cellValue}
                  </td>
                );
              })}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right space-x-3">
                <button 
                  onClick={() => onEdit(item)}
                  className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(item._id)}
                  className="text-rose-500 hover:text-rose-400 font-bold transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentTable;