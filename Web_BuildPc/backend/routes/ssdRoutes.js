const express = require('express');
const router = express.Router();
const { getAllSSDs, getSSDById } = require('../controllers/ssdController');

router.get('/', getAllSSDs);
router.get('/:id', getSSDById);

module.exports = router;