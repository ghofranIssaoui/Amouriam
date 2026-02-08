"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.signToken = exports.verifyTokenWithFallback = exports.getJwtSecret = exports.JWT_SECRETS = void 0;
// backend/src/utils/jwt-sync.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Standard JWT secrets for backward compatibility
exports.JWT_SECRETS = [
    process.env.JWT_SECRET,
    'your-secret-key',
    'amourium-secret-key',
    'default-jwt-secret'
].filter(Boolean);
// Get the primary JWT secret
const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'your-secret-key';
};
exports.getJwtSecret = getJwtSecret;
// Verify token with multiple secrets for backward compatibility
const verifyTokenWithFallback = (token) => {
    let lastError = null;
    for (const secret of exports.JWT_SECRETS) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            lastError = err;
            continue;
        }
    }
    throw lastError || new Error('Token verification failed');
};
exports.verifyTokenWithFallback = verifyTokenWithFallback;
// Sign token with current secret
const signToken = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, (0, exports.getJwtSecret)(), options);
};
exports.signToken = signToken;
// Check if token is expired
const isTokenExpired = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.exp)
            return true;
        return Date.now() >= decoded.exp * 1000;
    }
    catch (_a) {
        return true;
    }
};
exports.isTokenExpired = isTokenExpired;
