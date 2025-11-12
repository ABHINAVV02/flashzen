
import Deck from '../models/Deck.js';
import Activity from '../models/Activity.js';

export const createDeck = async (req, res) => {
  try {
    const deck = new Deck({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags || [],
      isFavourite: req.body.isFavourite || false
    });
    const savedDeck = await deck.save();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      type: 'deck_created',
      targetId: savedDeck._id,
      description: `Created deck: ${savedDeck.title}`
    });
    await activity.save();

    res.status(201).json(savedDeck);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user.id }).sort({ isFavourite: -1, createdAt: -1 });
    res.json(decks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    res.json(deck);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    deck.title = req.body.title || deck.title;
    deck.description = req.body.description || deck.description;
    deck.tags = req.body.tags || deck.tags;
    deck.isFavourite = req.body.isFavourite !== undefined ? req.body.isFavourite : deck.isFavourite;
    const updatedDeck = await deck.save();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      type: 'deck_updated',
      targetId: updatedDeck._id,
      description: `Updated deck: ${updatedDeck.title}`
    });
    await activity.save();

    res.json(updatedDeck);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleFavourite = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    deck.isFavourite = !deck.isFavourite;
    const updatedDeck = await deck.save();

    res.json(updatedDeck);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await deck.remove();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      type: 'deck_deleted',
      targetId: req.params.id,
      description: `Deleted deck: ${deck.title}`
    });
    await activity.save();

    res.json({ message: 'Deck removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
