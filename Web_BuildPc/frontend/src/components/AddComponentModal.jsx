import React, { useState } from 'react';
import { addComponent } from '../api/api';

const AddComponentModal = ({ isOpen, onClose, onAdd, type }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Base fields that EVERY component shares now, including SCORE!
  const baseFields = [
    { name: 'name', label: 'Component Name', type: 'text' },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'price', label: 'Price ($)', type: 'number' },
    { name: 'score', label: 'Benchmark Score', type: 'number' }
  ];

  let specificFields = [];
  switch (type) {
    case 'cpu':
      specificFields = [
        { name: 'socket', label: 'Socket', type: 'text' },
        { name: 'cores', label: 'Cores', type: 'number' },
        { name: 'threads', label: 'Threads', type: 'number' },
        { name: 'baseClock', label: 'Base Clock (GHz)', type: 'number' },
        { name: 'boostClock', label: 'Boost Clock (GHz)', type: 'number' },
        { name: 'tdp', label: 'TDP (W)', type: 'number' }
      ];
      break;
    case 'gpu':
      specificFields = [
        { name: 'vram', label: 'VRAM (GB)', type: 'number' },
        { name: 'clockSpeed', label: 'Base Clock (MHz)', type: 'number' },
        { name: 'boostClock', label: 'Boost Clock (MHz)', type: 'number' },
        { name: 'tdp', label: 'TDP (W)', type: 'number' }
      ];
      break;
    case 'motherboard':
      specificFields = [
        { name: 'socket', label: 'Socket', type: 'text' },
        { name: 'chipset', label: 'Chipset', type: 'text' },
        { name: 'ramType', label: 'RAM Type (e.g., DDR5)', type: 'text' },
        { name: 'maxRam', label: 'Max RAM (GB)', type: 'number' }
      ];
      break;
    case 'ram':
      specificFields = [
        { name: 'capacity', label: 'Capacity (GB)', type: 'number' },
        { name: 'speed', label: 'Speed (MHz)', type: 'number' },
        { name: 'type', label: 'Type (e.g., DDR5)', type: 'text' }
      ];
      break;
    case 'psu':
      specificFields = [
        { name: 'wattage', label: 'Wattage (W)', type: 'number' },
        { name: 'efficiency', label: 'Efficiency (e.g., 80+ Gold)', type: 'text' },
        { name: 'modular', label: 'Is Modular? (true/false)', type: 'text' }
      ];
      break;
    case 'ssd':
      specificFields = [
        { name: 'capacity', label: 'Capacity (GB)', type: 'number' },
        { name: 'type', label: 'Type (e.g., NVMe Gen4)', type: 'text' },
        { name: 'readSpeed', label: 'Read Speed (MB/s)', type: 'number' },
        { name: 'writeSpeed', label: 'Write Speed (MB/s)', type: 'number' }
      ];
      break;
    default:
      break;
  }

  const allFields = [...baseFields, ...specificFields];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert modular to boolean if applicable
    let finalValue = value;
    if (name === 'modular') finalValue = value === 'true';
    
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addComponent(type, formData);
      onAdd(); 
      setFormData({});
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add component.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-dark border border-neutral-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-700 pb-2 uppercase tracking-wide">
          Add New {type}
        </h2>
        {error && <div className="text-rose-500 mb-4 font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allFields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm text-neutral-400 mb-1 font-bold">{field.label}</label>
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                name={field.name}
                onChange={handleChange}
                required
                className="bg-primary text-white border border-neutral-600 rounded px-3 py-2 focus:outline-none focus:border-accent"
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end space-x-3 mt-4 border-t border-neutral-700 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-neutral-400 hover:text-white transition">Cancel</button>
            <button type="submit" disabled={loading} className="btn-accent px-6 shadow-md">
              {loading ? 'Adding...' : 'Save Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComponentModal;