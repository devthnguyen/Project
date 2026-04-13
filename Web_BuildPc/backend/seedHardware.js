const mongoose = require('mongoose');
const CPU = require('./models/CPU');
const GPU = require('./models/GPU');
const Motherboard = require('./models/Motherboard');
const RAM = require('./models/RAM');
const PSU = require('./models/PSU');
const SSD = require('./models/SSD');

// Connect directly to your local database
const MONGO_URI = 'mongodb://127.0.0.1:27017/benchmark-clone';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB. Starting mass data generation...'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- CPU GENERATOR ---
const generateCPUs = async () => {
  await CPU.deleteMany({});
  const cpus = [];
  
  const templates = [
    { brand: 'AMD', name: 'Ryzen 5', socket: 'AM4', cores: 6, threads: 12, baseClock: 3.7, boostClock: 4.6, tdp: 65 },
    { brand: 'AMD', name: 'Ryzen 7', socket: 'AM5', cores: 8, threads: 16, baseClock: 4.2, boostClock: 5.0, tdp: 105 },
    { brand: 'AMD', name: 'Ryzen 9', socket: 'AM5', cores: 12, threads: 24, baseClock: 4.7, boostClock: 5.6, tdp: 170 },
    { brand: 'Intel', name: 'Core i5', socket: 'LGA1700', cores: 14, threads: 20, baseClock: 3.5, boostClock: 5.1, tdp: 125 },
    { brand: 'Intel', name: 'Core i7', socket: 'LGA1700', cores: 16, threads: 24, baseClock: 3.4, boostClock: 5.4, tdp: 125 },
    { brand: 'Intel', name: 'Core i9', socket: 'LGA1700', cores: 24, threads: 32, baseClock: 3.2, boostClock: 6.0, tdp: 253 },
  ];

  for (let i = 0; i < 100; i++) {
    const t = templates[Math.floor(Math.random() * templates.length)];
    cpus.push({
      name: `${t.name} (Variant ${i + 1})`,
      brand: t.brand,
      price: Math.floor(Math.random() * 500) + 100,
      score: Math.floor(Math.random() * 30000) + 10000,
      socket: t.socket,
      cores: t.cores,
      threads: t.threads,
      baseClock: t.baseClock,
      boostClock: t.boostClock,
      tdp: t.tdp
    });
  }
  await CPU.insertMany(cpus);
  console.log(`Generated ${cpus.length} CPUs`);
};

// --- GPU GENERATOR ---
const generateGPUs = async () => {
  await GPU.deleteMany({});
  const gpus = [];
  
  const templates = [
    { brand: 'NVIDIA', name: 'RTX 3060', vram: 12, baseClock: 1320, boostClock: 1777, tdp: 170 },
    { brand: 'NVIDIA', name: 'RTX 4070', vram: 12, baseClock: 1920, boostClock: 2475, tdp: 200 },
    { brand: 'NVIDIA', name: 'RTX 4090', vram: 24, baseClock: 2235, boostClock: 2520, tdp: 450 },
    { brand: 'AMD', name: 'RX 6700 XT', vram: 12, baseClock: 2321, boostClock: 2581, tdp: 230 },
    { brand: 'AMD', name: 'RX 7800 XT', vram: 16, baseClock: 1295, boostClock: 2430, tdp: 263 },
    { brand: 'AMD', name: 'RX 7900 XTX', vram: 24, baseClock: 1855, boostClock: 2495, tdp: 355 },
  ];

  for (let i = 0; i < 100; i++) {
    const t = templates[Math.floor(Math.random() * templates.length)];
    gpus.push({
      name: `${t.name} (Variant ${i + 1})`,
      brand: t.brand,
      price: Math.floor(Math.random() * 1200) + 250,
      score: Math.floor(Math.random() * 35000) + 12000,
      vram: t.vram,
      baseClock: t.baseClock,
      boostClock: t.boostClock,
      tdp: t.tdp
    });
  }
  await GPU.insertMany(gpus);
  console.log(`Generated ${gpus.length} GPUs`);
};

// --- SSD GENERATOR ---
const generateSSDs = async () => {
  await SSD.deleteMany({});
  const ssds = [];
  
  const brands = ['Samsung', 'WD', 'Crucial', 'Kingston', 'Seagate'];
  const types = ['NVMe Gen3', 'NVMe Gen4', 'NVMe Gen5', 'SATA III'];
  const capacities = [500, 1000, 2000, 4000];

  for (let i = 0; i < 100; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const capacity = capacities[Math.floor(Math.random() * capacities.length)];
    
    // Fake speeds based on type
    let rSpeed = type.includes('Gen4') ? 7000 : type.includes('Gen5') ? 12000 : type.includes('Gen3') ? 3500 : 550;
    
    ssds.push({
      name: `${brand} Pro Drive ${capacity}GB (Variant ${i + 1})`,
      brand: brand,
      price: Math.floor(Math.random() * 300) + 50,
      score: Math.floor(Math.random() * 15000) + 3000,
      capacity: capacity,
      type: type,
      readSpeed: rSpeed,
      writeSpeed: rSpeed - 500
    });
  }
  await SSD.insertMany(ssds);
  console.log(`Generated ${ssds.length} SSDs`);
};

// --- MOTHERBOARD GENERATOR ---
const generateMotherboards = async () => {
  await Motherboard.deleteMany({});
  const motherboards = [];
  
  const templates = [
    { name: 'B450M A Pro', brand: 'MSI', socket: 'AM4', chipset: 'B450', ramType: 'DDR4', maxRam: 64 },
    { name: 'X570 Aorus Elite', brand: 'Gigabyte', socket: 'AM4', chipset: 'X570', ramType: 'DDR4', maxRam: 128 },
    { name: 'X670E Hero', brand: 'ASUS', socket: 'AM5', chipset: 'X670', ramType: 'DDR5', maxRam: 192 },
    { name: 'Z790 Tomahawk', brand: 'MSI', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', maxRam: 192 },
  ];

  for (let i = 0; i < 100; i++) {
    const t = templates[Math.floor(Math.random() * templates.length)];
    motherboards.push({
      name: `${t.name} (Variant ${i + 1})`,
      brand: t.brand,
      price: Math.floor(Math.random() * 300) + 70,
      score: Math.floor(Math.random() * 5000) + 5000,
      socket: t.socket,
      chipset: t.chipset,
      ramType: t.ramType,
      maxRam: t.maxRam
    });
  }
  await Motherboard.insertMany(motherboards);
  console.log(`Generated ${motherboards.length} Motherboards`);
};

// --- RAM GENERATOR ---
const generateRAM = async () => {
  await RAM.deleteMany({});
  const rams = [];
  
  const brands = ['Corsair', 'G.Skill', 'Crucial', 'Kingston'];
  const lines = ['Vengeance', 'Trident Z', 'Ballistix', 'Fury'];
  const configs = [
    { cap: 16, speeds: [3200, 3600], type: 'DDR4' },
    { cap: 32, speeds: [5600, 6000], type: 'DDR5' },
    { cap: 64, speeds: [6000, 6400], type: 'DDR5' },
  ];

  for (let i = 0; i < 100; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const line = lines[Math.floor(Math.random() * lines.length)];
    const c = configs[Math.floor(Math.random() * configs.length)];
    const speed = c.speeds[Math.floor(Math.random() * c.speeds.length)];
    
    rams.push({
      name: `${brand} ${line} ${c.cap}GB ${speed}MHz (Variant ${i + 1})`,
      brand: brand,
      price: Math.floor(Math.random() * 200) + 40,
      score: Math.floor(Math.random() * 4000) + 4000,
      capacity: c.cap,
      speed: speed,
      type: c.type
    });
  }
  await RAM.insertMany(rams);
  console.log(`Generated ${rams.length} RAM kits`);
};

// --- PSU GENERATOR ---
const generatePSU = async () => {
  await PSU.deleteMany({});
  const psus = [];
  
  const brands = ['Corsair', 'Seasonic', 'EVGA', 'Cooler Master'];
  const wattages = [650, 750, 850, 1000, 1200];
  const efficiencies = ['80+ Bronze', '80+ Gold', '80+ Platinum'];

  for (let i = 0; i < 100; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const wattage = wattages[Math.floor(Math.random() * wattages.length)];
    const efficiency = efficiencies[Math.floor(Math.random() * efficiencies.length)];
    
    psus.push({
      name: `${brand} Power ${wattage}W ${efficiency} (Variant ${i + 1})`,
      brand: brand,
      price: Math.floor(Math.random() * 180) + 50,
      score: Math.floor(Math.random() * 5000) + 5000,
      wattage: wattage,
      efficiency: efficiency,
      modular: Math.random() > 0.3
    });
  }
  await PSU.insertMany(psus);
  console.log(`Generated ${psus.length} PSUs`);
};

// --- RUN SCRIPT ---
const run = async () => {
  try {
    await generateCPUs();
    await generateGPUs();
    await generateSSDs();
    await generateMotherboards();
    await generateRAM();
    await generatePSU();
    
    console.log('✅ All 600 components successfully generated and connected to the web database!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Data generation failed:', err);
    process.exit(1);
  }
};

run();