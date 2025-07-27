import express from 'express';
import { body } from 'express-validator';
import * as messageController from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation middleware
const sendMessageValidation = [
  body('recipientId').isMongoId().withMessage('Valid recipient ID is required'),
  body('content').notEmpty().withMessage('Message content is required'),
  body('content').isLength({ max: 1000 }).withMessage('Message too long (max 1000 characters)')
];

// Protected routes
router.get('/conversations', authMiddleware, messageController.getConversations);
router.get('/conversation/:recipientId', authMiddleware, messageController.getConversation);
router.post('/send', authMiddleware, sendMessageValidation, messageController.sendMessage);
router.put('/:messageId/read', authMiddleware, messageController.markAsRead);
router.delete('/:messageId', authMiddleware, messageController.deleteMessage);

export default router; 