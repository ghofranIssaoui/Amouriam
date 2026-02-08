import { Router } from 'express';
import { submitMessage, getAllMessages, updateMessageStatus } from '../controllers/message.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

// Debug logging
router.use((req, res, next) => {
  console.log('Message routes - Request URL:', req.originalUrl);
  console.log('Message routes - Method:', req.method);
  next();
});

// Public route - submit message
router.post('/submit', submitMessage);

// Protected routes (admin only)
router.get('/all', auth, getAllMessages);
router.put('/:messageId/status', auth, updateMessageStatus);

export default router;
