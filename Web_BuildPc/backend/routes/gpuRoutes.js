const express = require('express');
const router = express.Router();
const { getAllGPUs, getGPUById } = require('../controllers/gpuController');

router.get('/', getAllGPUs);
router.get('/:id', getGPUById);

module.exports = router;