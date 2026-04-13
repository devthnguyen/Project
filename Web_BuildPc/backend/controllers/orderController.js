const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, address, totalPrice } = req.body;

    // Validation to prevent bad data from crashing Mongoose
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }
    if (!address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Create the order. Status defaults to 'pending' per the model.
    const order = new Order({
      user: req.user._id,
      items,
      address,
      totalPrice
    });

    const createdOrder = await order.save();

    // Link the order to the user's profile
    await User.findByIdAndUpdate(req.user._id, {
      $push: { orders: createdOrder._id }
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Get order by ID (This was the missing function!)
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is admin or the order belongs to the user
      if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};