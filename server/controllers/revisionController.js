import RevisionStat from '../models/RevisionStats.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

export const recordRevision = async (req, res) => {
  const { flashcardId, deckId, correct } = req.body;
  try {
    const stat = new RevisionStat({
      user: req.user.id,
      flashcard: flashcardId,
      deck: deckId,
      correct,
      reviewedAt: new Date()
    });
    await stat.save();

    // Update user gamification stats
    const user = await User.findById(req.user.id);
    if (correct) {
      user.points += 10;
      user.streak += 1;

      // Check for level up
      const newLevel = Math.floor(user.points / 100) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        // Award level up badge
        if (!user.badges.includes(`Level ${newLevel}`)) {
          user.badges.push(`Level ${newLevel}`);
        }
      }

      // Award streak badges
      if (user.streak === 7 && !user.badges.includes('Week Warrior')) {
        user.badges.push('Week Warrior');
      } else if (user.streak === 30 && !user.badges.includes('Month Master')) {
        user.badges.push('Month Master');
      }
    } else {
      user.streak = 0; // Reset streak on incorrect answer
    }

    await user.save();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      type: 'revision_completed',
      targetId: flashcardId,
      description: `Reviewed flashcard - ${correct ? 'Correct' : 'Incorrect'}`
    });
    await activity.save();

    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRevisionStatsForUser = async (req, res) => {
  try {
    const stats = await RevisionStat.find({ user: req.user.id })
      .populate('deck', 'title')
      .populate('flashcard', 'question')
      .sort({ reviewedAt: -1 })
      .limit(50);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
