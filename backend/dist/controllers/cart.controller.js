"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getOrCreateCart = void 0;
const mongoose_1 = require("mongoose");
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
// Get or create cart for a user
const getOrCreateCart = async (req, res) => {
    var _a;
    try {
        // @ts-ignore - We know user is set by auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'User authentication required' });
        }
        // Find existing cart for user
        let cart = await Cart_1.default.findOne({ user: userId }).populate('items.product', 'name price image');
        // Create new cart if doesn't exist
        if (!cart) {
            cart = new Cart_1.default({
                user: new mongoose_1.Types.ObjectId(userId),
                items: [],
                total: 0
            });
            await cart.save();
        }
        res.json(cart);
    }
    catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({
            message: 'Error fetching cart',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.getOrCreateCart = getOrCreateCart;
// Add item to cart
const addToCart = async (req, res) => {
    var _a;
    try {
        // @ts-ignore - We know user is set by auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'User authentication required' });
        }
        const { productId, quantity } = req.body;
        // Validate product exists
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Find or create cart
        let cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new Cart_1.default({ user: new mongoose_1.Types.ObjectId(userId), items: [], total: 0 });
        }
        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex >= 0) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
            // Add new item
            cart.items.push({
                product: new mongoose_1.Types.ObjectId(productId),
                user: new mongoose_1.Types.ObjectId(userId),
                quantity,
                price: product.price,
                addedAt: new Date()
            });
        }
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            message: 'Error adding to cart',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.addToCart = addToCart;
// Update item quantity
const updateCartItem = async (req, res) => {
    var _a;
    try {
        // @ts-ignore - We know user is set by auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'User authentication required' });
        }
        const { productId, quantity } = req.body;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }
        else {
            cart.items[itemIndex].quantity = quantity;
        }
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            message: 'Error updating cart',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.updateCartItem = updateCartItem;
// Remove item from cart
const removeFromCart = async (req, res) => {
    var _a;
    try {
        // @ts-ignore - We know user is set by auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'User authentication required' });
        }
        const { productId } = req.body;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            message: 'Error removing from cart',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.removeFromCart = removeFromCart;
// Clear cart
const clearCart = async (req, res) => {
    var _a;
    try {
        // @ts-ignore - We know user is set by auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'User authentication required' });
        }
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = [];
        cart.total = 0;
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            message: 'Error clearing cart',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.clearCart = clearCart;
