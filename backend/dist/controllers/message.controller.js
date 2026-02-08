"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessageStatus = exports.getAllMessages = exports.submitMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
/**
 * Submit a new message
 */
const submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, subject, message'
            });
        }
        // Create new message
        const newMessage = new Message_1.default({
            name,
            email,
            subject,
            message
        });
        const savedMessage = await newMessage.save();
        res.status(201).json({
            success: true,
            message: 'Message submitted successfully',
            data: savedMessage
        });
    }
    catch (error) {
        console.error('Error submitting message:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting message',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.submitMessage = submitMessage;
/**
 * Get all messages (admin only)
 */
const getAllMessages = async (req, res) => {
    try {
        // @ts-ignore - We know user is set by auth middleware
        const user = req.user;
        if (!user || !user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        const messages = await Message_1.default.find({})
            .sort({ createdAt: -1 }) // Most recent first
            .lean();
        res.json({
            success: true,
            messages
        });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.getAllMessages = getAllMessages;
/**
 * Update message status (admin only)
 */
const updateMessageStatus = async (req, res) => {
    try {
        // @ts-ignore - We know user is set by auth middleware
        const user = req.user;
        if (!user || !user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        const { messageId } = req.params;
        const { status } = req.body;
        if (!['pending', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: pending, read, or replied'
            });
        }
        const message = await Message_1.default.findByIdAndUpdate(messageId, { status }, { new: true });
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        res.json({
            success: true,
            message: 'Message status updated successfully',
            data: message
        });
    }
    catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating message status',
            error: error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : undefined
        });
    }
};
exports.updateMessageStatus = updateMessageStatus;
