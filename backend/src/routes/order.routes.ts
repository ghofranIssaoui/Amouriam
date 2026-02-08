import { Router } from 'express';
import { getUserOrders, createOrder, getOrder, getAllOrders } from '../controllers/order.controller';
import { auth } from '../middleware/auth.middleware';
import User from '../models/User';

const router = Router();

// Debug logging
router.use((req, res, next) => {
  console.log('Order routes - Request URL:', req.originalUrl);
  console.log('Order routes - Method:', req.method);
  next();
});

// Protected routes (require authentication)
router.get('/admin/all', auth, getAllOrders); // Admin endpoint for all orders
router.get('/', auth, getUserOrders); // Main orders endpoint for user orders
router.get('/my-orders', auth, getUserOrders); // Alternative endpoint
router.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Orders route working!' });
});
router.get('/:orderId', auth, getOrder); // Renamed parameter to avoid conflicts
router.post('/', auth, createOrder);
router.put('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    console.log('Update order - Order ID:', orderId);
    console.log('Update order - New status:', status);
    console.log('Update order - Request user:', req.user);
    
    // @ts-ignore - We know user is set by auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const Order = require('../models/Order').default;
    let order;
    
    console.log('Looking for order with ID:', orderId);
    console.log('User attempting update:', user._id, 'Type:', typeof user._id);
    console.log('User isAdmin:', user.isAdmin);
    
    // Admin can update any order, regular users can only update their own orders
    if (user.isAdmin) {
      order = await Order.findById(orderId);
      console.log('Admin lookup result:', order);
    } else {
      order = await Order.findOne({ _id: orderId, user: user._id });
      console.log('User lookup result:', order);
      if (!order) {
        // Try to find the order and check the user field
        const anyOrder = await Order.findById(orderId);
        console.log('Order found by ID:', anyOrder);
        if (anyOrder) {
          console.log('Order user field:', anyOrder.user, 'Type:', typeof anyOrder.user);
          console.log('Comparing with user._id:', user._id);
          console.log('Are they equal?', anyOrder.user.toString() === user._id.toString());
        }
      }
    }
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const oldStatus = order.status;
    order.status = status;
    await order.save();
    
    // Emit Socket.IO event for real-time updates
    const io = req.app.get('io');
    if (io) {
      // Notify the specific user who owns the order
      io.to(`user_${order.user}`).emit('orderStatusChanged', {
        orderId: order._id,
        oldStatus,
        newStatus: status,
        order: order
      });
      
      console.log(`Emitted order status change event for order ${orderId} to user ${order.user}`);
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      message: 'Error updating order',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
});

// Users endpoint (admin only)
router.get('/users/all', auth, async (req, res) => {
  try {
    console.log('Get all users - Request user:', req.user);
    
    // @ts-ignore - We know user is set by auth middleware
    const user = req.user;
    
    if (!user || !user.isAdmin) {
      console.log('Get all users - Admin access required, returning 403');
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const users = await User.find({})
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }) // Most recent first
      .lean();
      
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ 
      message: 'Error fetching all users',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
});

export default router;
