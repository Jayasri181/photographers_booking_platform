import express from 'express';
import { VirtualService } from '../services/virtual.service.js';
import { RealtimeService } from '../services/realtime.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();
const realtimeService = new RealtimeService();
const virtualService = new VirtualService(realtimeService);

// Create virtual session
router.post('/sessions', authenticate, asyncHandler(async (req, res) => {
  const { photographerId, sessionData } = req.body;
  const session = await virtualService.createVirtualSession(
    photographerId,
    req.user.id,
    sessionData
  );
  res.json({ success: true, session });
}));

// Get session details
router.get('/sessions/:sessionId', authenticate, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await virtualService.getSessionDetails(sessionId);
  res.json({ success: true, session });
}));

// Start virtual session
router.post('/sessions/:sessionId/start', authenticate, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await virtualService.startSession(sessionId);
  res.json({ success: true, session });
}));

// End virtual session
router.post('/sessions/:sessionId/end', authenticate, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await virtualService.endSession(sessionId);
  res.json({ success: true, session });
}));

// Suggest pose
router.post('/sessions/:sessionId/poses', authenticate, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { pose } = req.body;
  const suggestion = await virtualService.suggestPose(sessionId, pose);
  res.json({ success: true, suggestion });
}));

// Update virtual background
router.post(
  '/sessions/:sessionId/background',
  authenticate,
  upload.single('background'),
  asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const backgroundUrl = req.file ? req.file.path : req.body.backgroundUrl;
    const result = await virtualService.updateBackground(sessionId, backgroundUrl);
    res.json({ success: true, result });
  })
);

// Capture virtual photo
router.post(
  '/sessions/:sessionId/photos',
  authenticate,
  upload.single('photo'),
  asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const photoData = {
      ...req.body,
      photoUrl: req.file ? req.file.path : req.body.photoUrl
    };
    const photo = await virtualService.capturePhoto(sessionId, photoData);
    res.json({ success: true, photo });
  })
);

// Get session photos
router.get('/sessions/:sessionId/photos', authenticate, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const photos = await virtualService.getSessionPhotos(sessionId);
  res.json({ success: true, photos });
}));

// Get session chat history
router.get('/sessions/:sessionId/chat', authenticate, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const messages = await virtualService.getSessionChatHistory(sessionId);
  res.json({ success: true, messages });
}));

// Send chat message
router.post('/sessions/:sessionId/chat', authenticate, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { message, messageType = 'text', metadata = {} } = req.body;
  const chatMessage = await virtualService.sendChatMessage(
    sessionId,
    req.user.id,
    message,
    messageType,
    metadata
  );
  res.json({ success: true, message: chatMessage });
}));

export default router;
