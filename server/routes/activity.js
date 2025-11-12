import express from 'express';
const router = express.Router();
import { getUserActivities } from '../controllers/activityController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.get('/', protect, getUserActivities);

export default router;
