const RAM = require('../models/RAM');

exports.getAllRAM = async (req, res) => {
  try {
    const { search, limit = 150 } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const rams = await RAM.find(query).sort({ price: -1 }).limit(Number(limit));
    res.status(200).json(rams);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching RAM', details: err.message });
  }
};

exports.getRAMById = async (req, res) => {
  try {
    const ram = await RAM.findById(req.params.id);
    if (!ram) {
      return res.status(404).json({ message: 'RAM not found' });
    }
    res.status(200).json(ram);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching RAM', details: err.message });
  }
};