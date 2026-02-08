// backend/src/controllers/order.controller.ts
import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';

// backend/src/controllers/order.controller.ts
// backend/src/controllers/order.controller.ts
export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log('Order controller - Request body:', req.body);
    console.log('Order controller - Request user:', req.user);
    console.log('Order controller - Request headers:', req.headers);
    
    // Try to get user ID from auth middleware first, then from request body
    // @ts-ignore - We know user is set by the auth middleware
    const userId = req.user?._id || req.body.userId;
    
    console.log('Order controller - User ID:', userId);
    console.log('Order controller - User ID type:', typeof userId);
    
    if (!userId) {
      console.log('Order controller - No user ID found, returning 401');
      return res.status(401).json({ message: 'User authentication required' });
    }

    const { items, total, shippingAddress, paymentMethod } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // Create order with user ID
    const order = new Order({
      user: userId,
      items: items.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      paymentStatus: 'pending',
    });

    const savedOrder = await order.save();
    
    // Populate product details
    await savedOrder.populate('items.product', 'name price image');
    
    res.status(201).json(savedOrder);
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params; // Updated to match new parameter name
    console.log('Get order - Order ID:', orderId);
    console.log('Get order - Request user:', req.user);
    
    // @ts-ignore - We know user is set by the auth middleware
    const userId = req.user?._id;
    
    console.log('Get order - User ID:', userId);
    
    if (!userId) {
      console.log('Get order - No user ID found, returning 401');
      return res.status(401).json({ message: 'User authentication required' });
    }

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.product', 'name price image');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
      
    res.json(order);
  } catch (error: unknown) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      message: 'Error fetching order',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    console.log('Get user orders - Request user:', req.user);
    
    // @ts-ignore - We know user is set by the auth middleware
    const userId = req.user?._id;
    
    console.log('Get user orders - User ID:', userId);
    
    if (!userId) {
      console.log('Get user orders - No user ID found, returning 401');
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('items.product', 'name price image');
      
    res.json(orders);
  } catch (error: unknown) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Error fetching orders',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    console.log('Get all orders - Request user:', req.user);
    
    // @ts-ignore - We know user is set by the auth middleware
    const user = req.user;
    
    if (!user || !user.isAdmin) {
      console.log('Get all orders - Admin access required, returning 403');
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // Most recent first
      .populate('user', 'name email') // Include user details from UserBackend
      .lean(); // Convert to plain JavaScript objects
      
    res.json(orders);
  } catch (error: unknown) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ 
      message: 'Error fetching all orders',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};