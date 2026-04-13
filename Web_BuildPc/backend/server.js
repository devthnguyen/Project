const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Component Routes
const cpuRoutes = require('./routes/cpuRoutes');
const gpuRoutes = require('./routes/gpuRoutes');
const motherboardRoutes = require('./routes/motherboardRoutes');
const ramRoutes = require('./routes/ramRoutes');
const psuRoutes = require('./routes/psuRoutes');

// Feature Routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const buildRoutes = require('./routes/buildRoutes'); // <-- We added this!

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/benchmark-clone';

// Middleware
app.use(cors());
app.use(express.json());

// Apply Component Routes
app.use('/api/cpu', cpuRoutes);
app.use('/api/gpu', gpuRoutes);
app.use('/api/motherboards', motherboardRoutes);
app.use('/api/ram', ramRoutes);
app.use('/api/psu', psuRoutes);

// Apply Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/build', buildRoutes); // <-- And applied it here!

// Database connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
  // Add this with your other route imports
  const ssdRoutes = require('./routes/ssdRoutes');

  // Add this with your other app.use() statements
  app.use('/api/ssd', ssdRoutes);