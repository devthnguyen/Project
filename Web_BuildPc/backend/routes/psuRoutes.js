const express = require('express');
const router = express.Router();
const { getAllPSU, getPSUById } = require('../controllers/psuController');

router.get('/', getAllPSU);
router.get('/:id', getPSUById);

module.exports = router;