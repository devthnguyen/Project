import React, { useState, useEffect } from 'react';
import { getCPUs, getGPUs, getMotherboards, getRAMs, getPSUs, getSSDs, deleteComponent } from '../api/api';
import ComponentTable from '../components/ComponentTable';
import AddComponentModal from '../components/AddComponentModal';
import EditComponentModal from '../components/EditComponentModal';

const AdminComponentsPage = () => {
  const [activeTab, setActiveTab] = useState('cpu');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState(null);

  const tabs = [
    { id: 'cpu', label: 'Processors' },
    { id: 'gpu', label: 'Graphics Cards' },
    { id: 'motherboard', label: 'Motherboards' },
    { id: 'ram', label: 'Memory (RAM)' },
    { id: 'psu', label: 'Power Supplies' },
    { id: 'ssd', label: 'Storage (SSD)' } // <-- ADDED SSD TAB
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      let fetchedData = [];
      if (activeTab === 'cpu') fetchedData = await getCPUs('', 1000);
      if (activeTab === 'gpu') fetchedData = await getGPUs('', 1000);
      if (activeTab === 'motherboard') fetchedData = await getMotherboards('', 1000);
      if (activeTab === 'ram') fetchedData = await getRAMs('', 1000);
      if (activeTab === 'psu') fetchedData = await getPSUs('', 1000);
      if (activeTab === 'ssd') fetchedData = await getSSDs('', 1000); // <-- FETCH SSDs
      
      setData(fetchedData);
    } catch (err) {
      console.error("Failed to fetch admin components", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      try {
        await deleteComponent(activeTab, id);
        fetchData(); // Refresh list after delete
      } catch (err) {
        alert("Failed to delete component.");
        console.error(err);
      }
    }
  };

  const openEditModal = (item) => {
    setComponentToEdit(item);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Component Management</h1>
          <p className="mt-1 text-neutral-400">Add, edit, or remove hardware from the database.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-md transition-colors whitespace-nowrap"
        >
          + Add New {tabs.find(t => t.id === activeTab).label.split(' ')[0]}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-neutral-700/80 pb-2 custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-md font-bold text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-primary-dark text-accent border-b-2 border-accent' 
                : 'text-neutral-400 hover:text-white hover:bg-primary-dark/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-medium">Loading database records...</div>
      ) : (
        <ComponentTable data={data} type={activeTab} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      {/* Modals */}
      <AddComponentModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={fetchData} 
        type={activeTab} 
      />
      
      <EditComponentModal 
        isOpen={isEditOpen} 
        onClose={() => { setIsEditOpen(false); setComponentToEdit(null); }} 
        onUpdate={fetchData} 
        type={activeTab} 
        initialData={componentToEdit} 
      />
    </div>
  );
};

export default AdminComponentsPage;