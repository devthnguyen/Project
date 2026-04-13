const mongoose = require('mongoose');
const SSD = require('../models/SSD'); // Adjust path if you put this in the root backend folder

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/benchmark-clone';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB for SSD generation.'))
  .catch(err => console.error(err));

const generateSSDs = async () => {
  await SSD.deleteMany({});
  const ssds = [];
  
  const templates = [
    { name: 'Samsung 990 PRO', type: 'Gen4 NVMe M.2', readSpeed: 7450, writeSpeed: 6900, price: 170 },
    { name: 'WD Black SN850X', type: 'Gen4 NVMe M.2', readSpeed: 7300, writeSpeed: 6600, price: 150 },
    { name: 'Crucial P3 Plus', type: 'Gen4 NVMe M.2', readSpeed: 5000, writeSpeed: 4200, price: 65 },
    { name: 'Kingston NV2', type: 'Gen4 NVMe M.2', readSpeed: 3500, writeSpeed: 2800, price: 50 },
    { name: 'Samsung 870 EVO', type: 'SATA 2.5"', readSpeed: 560, writeSpeed: 530, price: 90 },
    { name: 'Crucial MX500', type: 'SATA 2.5"', readSpeed: 560, writeSpeed: 510, price: 75 },
  ];

  const capacities = [500, 1000, 2000, 4000]; // 500GB, 1TB, 2TB, 4TB

  for (let i = 0; i < 50; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const capacity = capacities[Math.floor(Math.random() * capacities.length)];
    
    // Adjust price based on capacity
    let multiplier = capacity === 500 ? 0.6 : capacity === 1000 ? 1 : capacity === 2000 ? 1.9 : 3.5;

    ssds.push({
      name: `${template.name} ${capacity >= 1000 ? capacity/1000 + 'TB' : capacity + 'GB'} (Variant ${i + 1})`,
      capacity: capacity,
      type: template.type,
      readSpeed: template.readSpeed,
      writeSpeed: template.writeSpeed,
      price: Math.floor(template.price * multiplier),
    });
  }
  
  await SSD.insertMany(ssds);
  console.log(`Successfully generated ${ssds.length} SSDs!`);
  process.exit(0);
};

generateSSDs();