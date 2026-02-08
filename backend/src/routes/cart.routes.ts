// backend/src/routes/cart.routes.ts
import { Router } from 'express';
import { 
  getOrCreateCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cart.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// All cart routes require authentication
router.get('/', auth, getOrCreateCart);
router.post('/add', auth, addToCart);
router.put('/update', auth, updateCartItem);
router.delete('/remove/:productId', auth, removeFromCart);
router.delete('/clear', auth, clearCart);

export default router;
