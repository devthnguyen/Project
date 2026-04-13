const express = require('express');
const router = express.Router();
const { getAllRAM, getRAMById } = require('../controllers/ramController');

router.get('/', getAllRAM);
router.get('/:id', getRAMById);

module.exports = router;