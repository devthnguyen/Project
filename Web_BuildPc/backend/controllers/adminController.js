const User = require('../models/User');
const Order = require('../models/Order');
const CPU = require('../models/CPU');
const GPU = require('../models/GPU');
const Motherboard = require('../models/Motherboard');
const RAM = require('../models/RAM');
const PSU = require('../models/PSU');
const SSD = require('../models/SSD');

// Helper to map string type to Mongoose Model
const getModelByType = (type) => {
  switch (type.toLowerCase()) {
    case 'cpu': return CPU;
    case 'gpu': return GPU;
    case 'motherboard': return Motherboard;
    case 'ram': return RAM;
    case 'psu': return PSU;
    case 'ssd': return SSD;
    default: return null;
  }
};

// --- USERS MANAGEMENT ---

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- ORDERS MANAGEMENT ---

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- COMPONENTS MANAGEMENT ---

exports.addComponent = async (req, res) => {
  try {
    const Model = getModelByType(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid component type' });

    const newComponent = new Model(req.body);
    const savedComponent = await newComponent.save();
    res.status(201).json(savedComponent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add component', error: error.message });
  }
};

exports.updateComponent = async (req, res) => {
  try {
    const Model = getModelByType(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid component type' });

    const updatedComponent = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedComponent) {
      res.json(updatedComponent);
    } else {
      res.status(404).json({ message: 'Component not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update component', error: error.message });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const Model = getModelByType(req.params.type);
    if (!Model) return res.status(400).json({ message: 'Invalid component type' });

    const component = await Model.findByIdAndDelete(req.params.id);
    if (component) {
      res.json({ message: 'Component removed' });
    } else {
      res.status(404).json({ message: 'Component not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete component', error: error.message });
  }
};