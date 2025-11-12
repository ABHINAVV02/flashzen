import mongoose from 'mongoose';

const RevisionStatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard', required: true },
  deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
  reviewedAt: { type: Date, default: Date.now },
  correct: { type: Boolean },  // whether user marked it correct or not
}, { timestamps: true });

export default mongoose.model('RevisionStat', RevisionStatSchema);
