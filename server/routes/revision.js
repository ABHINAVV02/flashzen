import express from 'express';
const router = express.Router();
import { protect } from '../middlewares/authMiddleware.js';
import {
  recordRevision,
  getRevisionStatsForUser
} from '../controllers/revisionController.js';

router.post('/', protect, recordRevision);
router.get('/', protect, getRevisionStatsForUser);

export default router;
