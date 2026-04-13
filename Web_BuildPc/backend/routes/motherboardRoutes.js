const express = require('express');
const router = express.Router();
const { getAllMotherboards, getMotherboardById } = require('../controllers/motherboardController');

router.get('/', getAllMotherboards);
router.get('/:id', getMotherboardById);

module.exports = router;