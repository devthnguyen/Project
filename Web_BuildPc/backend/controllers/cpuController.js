const CPU = require('../models/CPU');

// Get all CPUs (with optional search and sorting by score)
exports.getAllCPUs = async (req, res) => {
  try {
    const { search, limit = 300 } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Sort by score descending (highest benchmark first)
    const cpus = await CPU.find(query).sort({ score: -1 }).limit(Number(limit));
    res.status(200).json(cpus);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching CPUs', details: err.message });
  }
};

// Get a single CPU by ID
exports.getCPUById = async (req, res) => {
  try {
    const cpu = await CPU.findById(req.params.id);
    if (!cpu) {
      return res.status(404).json({ message: 'CPU not found' });
    }
    res.status(200).json(cpu);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching CPU', details: err.message });
  }
};