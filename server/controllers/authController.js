import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendDeleteConfirmationEmail, generateDeleteToken } from '../utils/emailService.js';

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;

    if (email) {
      // Validate email format
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
      }

      // if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another account' });
      }

      user.email = email;
    }

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .select('username email points level streak badges createdAt')
      .sort({ points: -1, level: -1, streak: -1 })
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSettings = async (req, res) => {
  const { settings } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.settings = { ...user.settings, ...settings };
    await user.save();
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const requestDeleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate delete token
    const deleteToken = generateDeleteToken();
    const deleteTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token to user
    user.deleteToken = deleteToken;
    user.deleteTokenExpiry = deleteTokenExpiry;
    await user.save();

    // Send confirmation email
    await sendDeleteConfirmationEmail(user.email, deleteToken);

    res.json({ message: 'Account deletion confirmation email sent. Please check your email.' });
  } catch (error) {
    console.error('Error requesting account deletion:', error);
    res.status(500).json({ message: 'Failed to send deletion confirmation email' });
  }
};

export const confirmDeleteAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      deleteToken: token,
      deleteTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired deletion token' });
    }

    // Delete all related data
    await Promise.all([
      // Delete user's decks and flashcards (assuming cascade delete or manual cleanup)
      // You might need to implement this based on your data relationships
      User.findByIdAndDelete(user._id)
    ]);

    res.json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};
