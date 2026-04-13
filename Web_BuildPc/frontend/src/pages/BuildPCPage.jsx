import React, { useState, useEffect, useContext } from 'react';
import { getCPUs, getGPUs, getMotherboards, getRAMs, getPSUs, getSSDs, saveBuild } from '../api/api';
import BuildPCSelector from '../components/BuildPCSelector';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BuildPCPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Component Lists State
  const [cpus, setCpus] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [motherboards, setMotherboards] = useState([]);
  const [rams, setRams] = useState([]);
  const [psus, setPsus] = useState([]);
  const [ssds, setSsds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection States
  const [selectedCpuId, setSelectedCpuId] = useState('');
  const [selectedGpuId, setSelectedGpuId] = useState('');
  const [selectedMoboId, setSelectedMoboId] = useState('');
  const [selectedRamId, setSelectedRamId] = useState('');
  const [selectedPsuId, setSelectedPsuId] = useState('');
  const [selectedSsdId, setSelectedSsdId] = useState('');

  // Fetch all component data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCpus, fetchedGpus, fetchedMobos, fetchedRams, fetchedPsus, fetchedSsds] = await Promise.all([
          getCPUs('', 300), getGPUs('', 300), getMotherboards('', 300), 
          getRAMs('', 300), getPSUs('', 300), getSSDs('', 300)
        ]);
        setCpus(fetchedCpus); setGpus(fetchedGpus); setMotherboards(fetchedMobos);
        setRams(fetchedRams); setPsus(fetchedPsus); setSsds(fetchedSsds);
        
        // 1. Load initial build state from localStorage ONCE after data is fetched
        const savedBuild = JSON.parse(localStorage.getItem('pcBuild'));
        if (savedBuild) {
          if (savedBuild.cpu) setSelectedCpuId(savedBuild.cpu._id);
          if (savedBuild.gpu) setSelectedGpuId(savedBuild.gpu._id);
          if (savedBuild.motherboard) setSelectedMoboId(savedBuild.motherboard._id);
          if (savedBuild.ram) setSelectedRamId(savedBuild.ram._id);
          if (savedBuild.psu) setSelectedPsuId(savedBuild.psu._id);
          if (savedBuild.ssd) setSelectedSsdId(savedBuild.ssd._id);
        }
      } catch (err) {
        console.error("Error fetching components for Builder", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Selected Objects mapped from IDs
  const cpu = cpus.find(c => c._id === selectedCpuId);
  const gpu = gpus.find(g => g._id === selectedGpuId);
  const mobo = motherboards.find(m => m._id === selectedMoboId);
  const ram = rams.find(r => r._id === selectedRamId);
  const psu = psus.find(p => p._id === selectedPsuId);
  const ssd = ssds.find(s => s._id === selectedSsdId);

  // 2. Sync selection changes back to localStorage automatically
  useEffect(() => {
    if (loading) return; // Prevent overwriting with nulls before data loads
    const currentBuild = { cpu, gpu, motherboard: mobo, ram, psu, ssd };
    localStorage.setItem('pcBuild', JSON.stringify(currentBuild));
  }, [cpu, gpu, mobo, ram, psu, ssd, loading]);

  const totalPrice = 
    (cpu?.price || 0) + (gpu?.price || 0) + (mobo?.price || 0) + 
    (ram?.price || 0) + (psu?.price || 0) + (ssd?.price || 0);

  const handleCheckout = () => {
    // Navigate to checkout and pass the selected components state
    const items = [];
    if (cpu) items.push({ name: cpu.name, price: cpu.price });
    if (gpu) items.push({ name: gpu.name, price: gpu.price });
    if (mobo) items.push({ name: mobo.name, price: mobo.price });
    if (ram) items.push({ name: ram.name, price: ram.price });
    if (psu) items.push({ name: psu.name, price: psu.price });
    if (ssd) items.push({ name: ssd.name, price: ssd.price });
    
    if (items.length === 0) return alert("Please select at least one component.");
    
    navigate('/checkout', { state: { items, totalPrice } });
  };

  if (loading) return <div className="text-center py-20 text-neutral-500 text-lg">Initializing PC Builder...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Custom PC Builder</h1>
        <p className="mt-2 text-neutral-400">Search and select components. Your build is automatically saved locally.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 ub-card p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-neutral-700/80 pb-2">Component Selection</h2>
          
          <BuildPCSelector 
            label="Processor (CPU)" 
            items={cpus} 
            selectedId={selectedCpuId} 
            onSelect={setSelectedCpuId} 
            renderDetails={(i) => `| Socket: ${i.socket || 'N/A'}`}
          />
          <BuildPCSelector 
            label="Motherboard" 
            items={motherboards} 
            selectedId={selectedMoboId} 
            onSelect={setSelectedMoboId} 
            renderDetails={(i) => `| ${i.socket || 'N/A'} | ${i.ramType || 'N/A'}`} 
          />
          <BuildPCSelector 
            label="Memory (RAM)" 
            items={rams} 
            selectedId={selectedRamId} 
            onSelect={setSelectedRamId} 
            renderDetails={(i) => `| ${i.capacity || '?'}GB ${i.speed ? i.speed + 'MHz' : ''}`} 
          />
          <BuildPCSelector 
            label="Graphics Card (GPU)" 
            items={gpus} 
            selectedId={selectedGpuId} 
            onSelect={setSelectedGpuId} 
            renderDetails={(i) => i.brand ? `| ${i.brand}` : ''} 
          />
          <BuildPCSelector 
            label="Storage (SSD)" 
            items={ssds} 
            selectedId={selectedSsdId} 
            onSelect={setSelectedSsdId} 
            renderDetails={(i) => `| ${i.capacity || '?'}GB ${i.type || ''}`} 
          />
          <BuildPCSelector 
            label="Power Supply (PSU)" 
            items={psus} 
            selectedId={selectedPsuId} 
            onSelect={setSelectedPsuId} 
            renderDetails={(i) => i.wattage ? `| ${i.wattage}W` : ''} 
          />
        </div>

        <div className="lg:col-span-1 space-y-6 sticky top-20">
          <div className="ub-card p-6 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-4 border-b border-neutral-700/80 pb-2">Build Summary</h3>
             <div className="flex justify-between items-center pt-2">
               <span className="text-neutral-300 font-bold uppercase tracking-wide">Total Price</span>
               <span className="text-white text-3xl font-black text-accent">${totalPrice}</span>
             </div>

             <div className="mt-8 space-y-4">
              <button 
                onClick={handleCheckout}
                disabled={totalPrice === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-lg rounded-lg shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPCPage;