// backend/src/routes/auth.ts
import express from 'express';
import { login, register, getMe } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', getMe);

export default router;
