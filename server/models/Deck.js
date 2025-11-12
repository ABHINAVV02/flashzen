import mongoose from 'mongoose';

const DeckSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFavourite: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Deck', DeckSchema);
