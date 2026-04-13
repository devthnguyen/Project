const express = require('express');
const router = express.Router();
const { getAllCPUs, getCPUById } = require('../controllers/cpuController');

router.get('/', getAllCPUs);
router.get('/:id', getCPUById);

module.exports = router;