const GPU = require('../models/GPU');

// Get all GPUs (with optional search and sorting by score)
exports.getAllGPUs = async (req, res) => {
  try {
    const { search, limit = 300 } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Sort by score descending (highest benchmark first)
    const gpus = await GPU.find(query).sort({ score: -1 }).limit(Number(limit));
    res.status(200).json(gpus);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching GPUs', details: err.message });
  }
};

// Get a single GPU by ID
exports.getGPUById = async (req, res) => {
  try {
    const gpu = await GPU.findById(req.params.id);
    if (!gpu) {
      return res.status(404).json({ message: 'GPU not found' });
    }
    res.status(200).json(gpu);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching GPU', details: err.message });
  }
};