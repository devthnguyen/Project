const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  deleteUser, 
  getAllOrders, 
  updateOrderStatus, 
  addComponent, 
  updateComponent, 
  deleteComponent 
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// User Management
router.route('/users')
  .get(protect, admin, getAllUsers);
router.route('/users/:id')
  .delete(protect, admin, deleteUser);

// Order Management
router.route('/orders')
  .get(protect, admin, getAllOrders);
router.route('/orders/:id')
  .put(protect, admin, updateOrderStatus);

// Component Management
router.route('/components/:type')
  .post(protect, admin, addComponent);
router.route('/components/:type/:id')
  .put(protect, admin, updateComponent)
  .delete(protect, admin, deleteComponent);

module.exports = router;