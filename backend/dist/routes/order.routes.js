"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// Debug logging
router.use((req, res, next) => {
    console.log('Order routes - Request URL:', req.originalUrl);
    console.log('Order routes - Method:', req.method);
    next();
});
// Protected routes (require authentication)
router.get('/admin/all', auth_middleware_1.auth, order_controller_1.getAllOrders); // Admin endpoint for all orders
router.get('/', auth_middleware_1.auth, order_controller_1.getUserOrders); // Main orders endpoint for user orders
router.get('/my-orders', auth_middleware_1.auth, order_controller_1.getUserOrders); // Alternative endpoint
router.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Orders route working!' });
});
router.get('/:orderId', auth_middleware_1.auth, order_controller_1.getOrder); // Renamed parameter to avoid conflicts
router.post('/', auth_middleware_1.auth, order_controller_1.createOrder);
router.put('/:orderId', auth_middleware_1.auth, async (req, res) => {
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
        // Admin can update any order, regular users can only update their own orders
        if (user.isAdmin) {
            order = await Order.findById(orderId);
        }
        else {
            order = await Order.findOne({ _id: orderId, user: user._id });
        }
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = status;
        await order.save();
        res.json(order);
    }
    catch (error) {
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
router.get('/users/all', auth_middleware_1.auth, async (req, res) => {
    try {
        console.log('Get all users - Request user:', req.user);
        // @ts-ignore - We know user is set by auth middleware
        const user = req.user;
        if (!user || !user.isAdmin) {
            console.log('Get all users - Admin access required, returning 403');
            return res.status(403).json({ message: 'Admin access required' });
        }
        const users = await User_1.default.find({})
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 }) // Most recent first
            .lean();
        res.json({
            success: true,
            users
        });
    }
    catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            message: 'Error fetching all users',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
});
exports.default = router;
