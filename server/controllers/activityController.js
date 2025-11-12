import Activity from '../models/Activity.js';

export const getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20); // Limit recent 20 activities
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
