import React from 'react';

const ComponentTable = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-neutral-500">No components found for this category.</div>;
  }

  // Dynamically generate headers based on the keys of the first object, ignoring DB specific keys
  const excludeKeys = ['_id', '__v', 'createdAt', 'updatedAt'];
  const headers = Object.keys(data[0]).filter(key => !excludeKeys.includes(key));

  return (
    <div className="overflow-x-auto ub-card shadow-xl">
      <table className="min-w-full divide-y divide-neutral-800 table-auto">
        <thead className="bg-primary-dark">
          <tr>
            {headers.map(header => (
              <th key={header} className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">
                {header}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-bold text-neutral-400 uppercase tracking-tight">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-primary-dark divide-y divide-neutral-800/60">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-primary-light/30 transition-colors">
              {headers.map(header => (
                <td key={`${item._id}-${header}`} className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                  {/* Format boolean values to Yes/No, else show value */}
                  {typeof item[header] === 'boolean' ? (item[header] ? 'Yes' : 'No') : item[header]}
                </td>
              ))}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right space-x-3">
                <button 
                  onClick={() => onEdit(item)}
                  className="text-blue-400 hover:text-blue-300 font-bold"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(item._id)}
                  className="text-rose-500 hover:text-rose-400 font-bold"
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