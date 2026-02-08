"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.register = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Check if password is correct
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }, JWT_SECRET, { expiresIn: '7d' });
        // Return user data without password
        const userData = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            role: user.role
        };
        res.json({
            message: 'Login successful',
            user: userData,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        // Create new user
        const user = new User_1.default({
            name,
            email,
            password,
            isAdmin: false,
            addresses: [],
            orders: [],
            wishlist: []
        });
        await user.save();
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }, JWT_SECRET, { expiresIn: '7d' });
        // Return user data without password
        const userData = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            role: user.role
        };
        res.status(201).json({
            message: 'User created successfully',
            user: userData,
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const getMe = async (req, res) => {
    var _a;
    try {
        // This would require auth middleware to get user from token
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Transform user data to match frontend expectations
        const userData = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            role: user.role
        };
        res.json({ user: userData });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.getMe = getMe;
