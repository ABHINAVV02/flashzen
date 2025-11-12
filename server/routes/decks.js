import express from 'express';
const router = express.Router();
import { createDeck, getUserDecks, getDeckById, updateDeck, toggleFavourite, deleteDeck } from '../controllers/deckController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.post('/', protect, createDeck);
router.get('/', protect, getUserDecks);
router.get('/:id', protect, getDeckById);
router.put('/:id', protect, updateDeck);
router.patch('/:id/favourite', protect, toggleFavourite);
router.delete('/:id', protect, deleteDeck);

export default router;
