"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.getAllUsers = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_sync_1 = require("../utils/jwt-sync");
// Configuration
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d');
// Error messages
const ERROR_MESSAGES = {
    REGISTRATION: {
        EMAIL_EXISTS: 'Email is already registered',
        VALIDATION: 'Validation error',
        SERVER: 'Error during registration'
    },
    LOGIN: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        SERVER: 'Error during login'
    },
    AUTH: {
        UNAUTHORIZED: 'Not authorized',
        USER_NOT_FOUND: 'User not found'
    }
};
/**
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and name'
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: ERROR_MESSAGES.REGISTRATION.EMAIL_EXISTS
            });
        }
        // Create new user
        const user = await User_1.default.create({ email, password, name });
        // Generate JWT token
        const token = (0, jwt_sync_1.signToken)({ id: user._id }, { expiresIn: JWT_EXPIRES_IN });
        // Return response
        res.status(201).json({
            success: true,
            user: user.toJSON(),
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.REGISTRATION.SERVER
        });
    }
};
exports.register = register;
/**
 * Login user and return JWT token
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        // Find user by email
        const user = await User_1.default.findOne({ email }).select('+password');
        // Check if user exists and password is correct
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: ERROR_MESSAGES.LOGIN.INVALID_CREDENTIALS
            });
        }
        // Generate JWT token
        const token = (0, jwt_sync_1.signToken)({ id: user._id }, { expiresIn: JWT_EXPIRES_IN });
        // Return response
        res.json({
            success: true,
            user: user.toJSON(),
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.LOGIN.SERVER
        });
    }
};
exports.login = login;
/**
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {
    console.log('getAllUsers function called!');
    try {
        // @ts-ignore - We know user is set by auth middleware
        const user = req.user;
        if (!user || !user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
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
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getAllUsers = getAllUsers;
const getCurrentUser = async (req, res) => {
    var _a;
    try {
        // req.user is set by the auth middleware
        const user = await User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: ERROR_MESSAGES.AUTH.USER_NOT_FOUND
            });
        }
        res.json({
            success: true,
            user: user.toJSON()
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
exports.getCurrentUser = getCurrentUser;
