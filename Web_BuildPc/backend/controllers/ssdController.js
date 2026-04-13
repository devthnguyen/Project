const SSD = require('../models/SSD');

exports.getAllSSDs = async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const ssds = await SSD.find(query).sort({ price: -1 }).limit(Number(limit));
    res.status(200).json(ssds);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching SSDs', details: err.message });
  }
};

exports.getSSDById = async (req, res) => {
  try {
    const ssd = await SSD.findById(req.params.id);
    if (!ssd) {
      return res.status(404).json({ message: 'SSD not found' });
    }
    res.status(200).json(ssd);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching SSD', details: err.message });
  }
};