import express from 'express';
const router = express.Router();
import { createFlashcard, getDeckFlashcards, getUserFlashcards, updateFlashcard, deleteFlashcard } from '../controllers/flashcardController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.post('/', protect, createFlashcard);
router.get('/user', protect, getUserFlashcards);
router.get('/:deckId', protect, getDeckFlashcards);
router.put('/:id', protect, updateFlashcard);
router.delete('/:id', protect, deleteFlashcard);

export default router;
