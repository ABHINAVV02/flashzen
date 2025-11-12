import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getProfile, updateProfile, getLeaderboard, updateSettings, deleteAccount } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/leaderboard', protect, getLeaderboard);
router.put('/settings', protect, updateSettings);
router.delete('/delete-account', protect, deleteAccount);

export default router;
