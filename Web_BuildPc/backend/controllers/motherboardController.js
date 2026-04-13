const Motherboard = require('../models/Motherboard');

exports.getAllMotherboards = async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const motherboards = await Motherboard.find(query).sort({ price: -1 }).limit(Number(limit));
    res.status(200).json(motherboards);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching Motherboards', details: err.message });
  }
};

exports.getMotherboardById = async (req, res) => {
  try {
    const motherboard = await Motherboard.findById(req.params.id);
    if (!motherboard) {
      return res.status(404).json({ message: 'Motherboard not found' });
    }
    res.status(200).json(motherboard);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching Motherboard', details: err.message });
  }
};