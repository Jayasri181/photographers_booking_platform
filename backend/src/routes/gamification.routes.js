import express from 'express';
import { GamificationService } from '../services/gamification.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Get user rewards and achievements
router.get('/rewards', authenticate, asyncHandler(async (req, res) => {
  const rewards = await GamificationService.getUserRewards(req.user.id);
  res.json({ success: true, rewards });
}));

// Award points for an action
router.post('/points', authenticate, asyncHandler(async (req, res) => {
  const { action } = req.body;
  const points = await GamificationService.awardPoints(req.user.id, action);
  res.json({ success: true, points });
}));

// Create a new contest
router.post('/contests', authenticate, asyncHandler(async (req, res) => {
  const contestData = req.body;
  const contest = await GamificationService.createContest(contestData);
  res.json({ success: true, contest });
}));

// Get active contests
router.get('/contests', asyncHandler(async (req, res) => {
  const contests = await GamificationService.getActiveContests();
  res.json({ success: true, contests });
}));

// Submit contest entry
router.post(
  '/contests/:contestId/entries',
  authenticate,
  upload.single('photo'),
  asyncHandler(async (req, res) => {
    const { contestId } = req.params;
    const photoUrl = req.file ? req.file.path : null;
    const entryData = {
      ...req.body,
      photoUrl
    };
    
    const entry = await GamificationService.submitContestEntry(
      req.user.id,
      contestId,
      entryData
    );
    
    res.json({ success: true, entry });
  })
);

// Get contest entries
router.get('/contests/:contestId/entries', asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  const entries = await GamificationService.getContestEntries(contestId);
  res.json({ success: true, entries });
}));

// Vote for a contest entry
router.post(
  '/contests/entries/:entryId/vote',
  authenticate,
  asyncHandler(async (req, res) => {
    const { entryId } = req.params;
    const vote = await GamificationService.voteForEntry(req.user.id, entryId);
    res.json({ success: true, vote });
  })
);

// Get leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { timeRange = '7d', limit = 10 } = req.query;
  const leaderboard = await GamificationService.getLeaderboard(timeRange, limit);
  res.json({ success: true, leaderboard });
}));

export default router;
