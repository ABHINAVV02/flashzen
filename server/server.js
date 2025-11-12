import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/auth.js';
import deckRoutes from './routes/decks.js';
import flashcardRoutes from './routes/flashcards.js';
import activityRoutes from './routes/activity.js';
import revisionRoutes from './routes/revision.js';

app.use('/api/revision', revisionRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/flashcards', flashcardRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Flashcard Manager API running');
});

// Export app for testing
export default app;
