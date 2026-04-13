const PSU = require('../models/PSU');

exports.getAllPSU = async (req, res) => {
  try {
    const { search, limit = 80 } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const psus = await PSU.find(query).sort({ price: -1 }).limit(Number(limit));
    res.status(200).json(psus);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching PSUs', details: err.message });
  }
};

exports.getPSUById = async (req, res) => {
  try {
    const psu = await PSU.findById(req.params.id);
    if (!psu) {
      return res.status(404).json({ message: 'PSU not found' });
    }
    res.status(200).json(psu);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching PSU', details: err.message });
  }
};