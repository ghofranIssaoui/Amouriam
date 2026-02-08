import { Request, Response } from 'express';
import Message, { IMessage } from '../models/Message';

/**
 * Submit a new message
 */
export const submitMessage = async (req: Request, res: Response) => {
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
    const newMessage = new Message({
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
    
  } catch (error: unknown) {
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

/**
 * Get all messages (admin only)
 */
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - We know user is set by auth middleware
    const user = req.user;
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }
    
    const messages = await Message.find({})
      .sort({ createdAt: -1 }) // Most recent first
      .lean();
      
    res.json({
      success: true,
      messages
    });
    
  } catch (error: unknown) {
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

/**
 * Update message status (admin only)
 */
export const updateMessageStatus = async (req: Request, res: Response) => {
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
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    
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
    
  } catch (error: unknown) {
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
