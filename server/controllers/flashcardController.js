// flashcardController.js
import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js';
import Activity from '../models/Activity.js';

export const createFlashcard = async (req, res) => {
  try {
    const deck = await Deck.findById(req.body.deck);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const flashcard = new Flashcard({
      deck: req.body.deck,
      question: req.body.question,
      answer: req.body.answer,
      tags: req.body.tags || []
    });
    const savedCard = await flashcard.save();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      type: 'flashcard_created',
      targetId: savedCard._id,
      description: `Created flashcard: ${savedCard.question.substring(0, 50)}...`
    });
    await activity.save();

    res.status(201).json(savedCard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({}).populate('deck').sort({ createdAt: -1 });
    // Filter flashcards to only include those from decks owned by the user
    const userFlashcards = flashcards.filter(card => card.deck && card.deck.user.toString() === req.user.id);
    res.json(userFlashcards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDeckFlashcards = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.deckId);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const flashcards = await Flashcard.find({ deck: req.params.deckId });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });

    const deck = await Deck.findById(flashcard.deck);
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    flashcard.question = req.body.question || flashcard.question;
    flashcard.answer = req.body.answer || flashcard.answer;
    flashcard.tags = req.body.tags || flashcard.tags;
    const updatedCard = await flashcard.save();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      type: 'flashcard_updated',
      targetId: updatedCard._id,
      description: `Updated flashcard: ${updatedCard.question.substring(0, 50)}...`
    });
    await activity.save();

    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });

    const deck = await Deck.findById(flashcard.deck);
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await flashcard.remove();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      type: 'flashcard_deleted',
      targetId: req.params.id,
      description: `Deleted flashcard: ${flashcard.question.substring(0, 50)}...`
    });
    await activity.save();

    res.json({ message: 'Flashcard removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
