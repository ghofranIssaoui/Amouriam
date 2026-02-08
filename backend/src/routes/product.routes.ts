import { Router } from 'express';
import { getProducts, getProductById, createProduct, seedProducts } from '../controllers/product.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', auth, createProduct);
router.post('/seed', seedProducts);

export default router;
