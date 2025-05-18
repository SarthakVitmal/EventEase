import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { username, email, password, mobileNumber, dateOfBirth } = req.body;

    // Validate input
    if (!username || !email || !password || !mobileNumber || !dateOfBirth) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
      dateOfBirth: new Date(dateOfBirth),
    });

    await user.save();

    // Return success (without sensitive data)
    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};