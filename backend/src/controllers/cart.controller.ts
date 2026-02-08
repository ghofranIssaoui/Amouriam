// backend/src/controllers/cart.controller.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Cart, { ICart } from '../models/Cart';
import Product from '../models/Product';

// Get or create cart for a user
export const getOrCreateCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - We know user is set by auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    // Find existing cart for user
    let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price image');

    // Create new cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        user: new Types.ObjectId(userId),
        items: [],
        total: 0
      });
      await cart.save();
    }

    res.json(cart);
  } catch (error: unknown) {
    console.error('Error getting cart:', error);
    res.status(500).json({ 
      message: 'Error fetching cart',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - We know user is set by auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const { productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: new Types.ObjectId(userId), items: [], total: 0 });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: new Types.ObjectId(productId),
        user: new Types.ObjectId(userId),
        quantity,
        price: product.price,
        addedAt: new Date()
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error: unknown) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      message: 'Error adding to cart',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};

// Update item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - We know user is set by auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (error: unknown) {
    console.error('Error updating cart:', error);
    res.status(500).json({ 
      message: 'Error updating cart',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - We know user is set by auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (error: unknown) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ 
      message: 'Error removing from cart',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - We know user is set by auth middleware
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();
    res.json(cart);
  } catch (error: unknown) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ 
      message: 'Error clearing cart',
      error: error instanceof Error && process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
};
