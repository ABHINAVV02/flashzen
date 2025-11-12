import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema({
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

export default mongoose.model('Flashcard', FlashcardSchema);
