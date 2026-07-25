const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new one with a random password
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: hashedPassword
      });
      await user.save();
    }

    // Issue standard JWT token for the session
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during Google login' });
  }
};
