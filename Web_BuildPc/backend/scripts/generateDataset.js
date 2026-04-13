const mongoose = require('mongoose');
const CPU = require('./models/CPU'); // Ensure your paths point to your actual models
const GPU = require('./models/GPU');
const SSD = require('./models/SSD');
const Motherboard = require('./models/Motherboard');
const RAM = require('./models/RAM');
const PSU = require('./models/PSU');

// Using your hardcoded URI to bypass any .env issues
const MONGO_URI = 'mongodb://127.0.0.1:27017/benchmark-clone';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB for dataset generation.'))
  .catch(err => console.error(err));

// ... (Assuming your generateCPUs, generateGPUs, and generateSSDs functions remain here)

const generateMotherboards = async () => {
  await Motherboard.deleteMany({});
  const motherboards = [];
  
  // Added brand to the templates to satisfy the Schema requirement
  const templates = [
    { name: 'B450M A Pro', brand: 'MSI', socket: 'AM4', chipset: 'B450', ramType: 'DDR4', maxRam: 64 },
    { name: 'B550 Tomahawk', brand: 'MSI', socket: 'AM4', chipset: 'B550', ramType: 'DDR4', maxRam: 128 },
    { name: 'X570 Aorus Elite', brand: 'Gigabyte', socket: 'AM4', chipset: 'X570', ramType: 'DDR4', maxRam: 128 },
    { name: 'B650E PG Riptide', brand: 'ASRock', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', maxRam: 128 },
    { name: 'X670E Hero', brand: 'ASUS', socket: 'AM5', chipset: 'X670', ramType: 'DDR5', maxRam: 192 },
    { name: 'B660M DS3H', brand: 'Gigabyte', socket: 'LGA1700', chipset: 'B660', ramType: 'DDR4', maxRam: 128 },
    { name: 'Z690 Gaming X', brand: 'Gigabyte', socket: 'LGA1700', chipset: 'Z690', ramType: 'DDR5', maxRam: 128 },
    { name: 'Z790 Tomahawk WiFi', brand: 'MSI', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', maxRam: 192 },
  ];

  for (let i = 0; i < 100; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    motherboards.push({
      name: `${template.name} (Variant ${i + 1})`,
      brand: template.brand,
      socket: template.socket,
      chipset: template.chipset,
      ramType: template.ramType,
      maxRam: template.maxRam,
      price: Math.floor(Math.random() * 300) + 70,
      score: Math.floor(Math.random() * 5000) + 5000 // Generates a random score between 5000 and 10000
    });
  }
  await Motherboard.insertMany(motherboards);
  console.log(`Generated ${motherboards.length} Motherboards`);
};

const generateRAM = async () => {
  await RAM.deleteMany({});
  const rams = [];
  
  // Separated brand from the product line to satisfy the explicit brand Schema field
  const brands = ['Corsair', 'G.Skill', 'Crucial', 'Kingston', 'TeamGroup'];
  const lines = ['Vengeance', 'Trident Z', 'Ballistix', 'Fury', 'T-Force'];
  
  const configs = [
    { cap: 16, speeds: [3200, 3600], type: 'DDR4' },
    { cap: 32, speeds: [3200, 3600], type: 'DDR4' },
    { cap: 32, speeds: [5200, 5600, 6000], type: 'DDR5' },
    { cap: 64, speeds: [5600, 6000, 6400], type: 'DDR5' },
  ];

  for (let i = 0; i < 150; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const line = lines[Math.floor(Math.random() * lines.length)];
    const config = configs[Math.floor(Math.random() * configs.length)];
    const speed = config.speeds[Math.floor(Math.random() * config.speeds.length)];
    
    rams.push({
      name: `${brand} ${line} ${config.cap}GB ${speed}MHz ${config.type} (Variant ${i + 1})`,
      brand: brand,
      capacity: config.cap,
      speed: speed,
      type: config.type,
      price: Math.floor(Math.random() * 200) + 40,
      score: Math.floor(Math.random() * 4000) + 4000 // Generates a random score
    });
  }
  await RAM.insertMany(rams);
  console.log(`Generated ${rams.length} RAM kits`);
};

const generatePSU = async () => {
  await PSU.deleteMany({});
  const psus = [];
  
  const brands = ['Corsair', 'Seasonic', 'EVGA', 'Cooler Master', 'Thermaltake'];
  const models = ['RM', 'Focus', 'SuperNOVA', 'MWE', 'Toughpower'];
  const wattages = [500, 600, 650, 750, 850, 1000, 1200];
  const efficiencies = ['80+ Bronze', '80+ Gold', '80+ Platinum'];

  for (let i = 0; i < 80; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const wattage = wattages[Math.floor(Math.random() * wattages.length)];
    const efficiency = efficiencies[Math.floor(Math.random() * efficiencies.length)];
    
    psus.push({
      name: `${brand} ${model} ${wattage}W ${efficiency} (Variant ${i + 1})`,
      brand: brand, // Explicitly saved to the database now
      wattage: wattage,
      efficiency: efficiency,
      modular: Math.random() > 0.3, // 70% chance to be modular
      price: Math.floor(Math.random() * 180) + 50,
      score: Math.floor(Math.random() * 5000) + 5000 // Generates a random score
    });
  }
  await PSU.insertMany(psus);
  console.log(`Generated ${psus.length} PSUs`);
};

const run = async () => {
  try {
    // Uncomment these if you add the CPU/GPU/SSD generators back in!
    // await generateCPUs();
    // await generateGPUs();
    // await generateSSDs();
    await generateMotherboards();
    await generateRAM();
    await generatePSU();
    
    console.log('Dataset generation complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();