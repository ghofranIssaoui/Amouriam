"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_sync_1 = require("../utils/jwt-sync");
const auth = async (req, res, next) => {
    try {
        console.log('Auth middleware - Request URL:', req.originalUrl);
        console.log('Auth middleware - Request method:', req.method);
        // Get token from header
        const authHeader = req.header('Authorization');
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace('Bearer ', '');
        if (!token) {
            console.log('Auth middleware - No token found');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        // Verify token with fallback secrets
        let decoded;
        try {
            decoded = (0, jwt_sync_1.verifyTokenWithFallback)(token);
            console.log('Auth middleware - Token verified successfully');
        }
        catch (err) {
            console.error('Auth middleware - Token verification failed:', err.message);
            return res.status(401).json({
                message: 'Token is not valid',
                requiresReauth: true,
                error: 'Token signature mismatch - please login again'
            });
        }
        console.log('Auth middleware - Decoded token:', decoded);
        // Verify user still exists in database
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            console.log('Auth middleware - User not found in database');
            return res.status(401).json({
                message: 'User not found',
                requiresReauth: true
            });
        }
        // Add user from payload
        req.user = {
            _id: decoded.id,
            isAdmin: user.isAdmin,
            email: user.email,
            name: user.name
        };
        console.log('Auth middleware - User authenticated successfully');
        next();
    }
    catch (err) {
        console.error('Auth middleware - Unexpected error:', err);
        res.status(401).json({
            message: 'Authentication failed',
            requiresReauth: true,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
exports.auth = auth;
