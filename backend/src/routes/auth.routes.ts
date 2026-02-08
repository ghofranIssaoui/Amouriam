import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.get('/test', auth, (req, res) => {
  res.json({ message: 'Auth test route working!' });
});
router.get('/all', auth, authController.getAllUsers); // Admin endpoint for all users

export default router;
