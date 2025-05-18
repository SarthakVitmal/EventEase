import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    // Validate mobile number format (10-15 digits)
    const formattedMobile = mobileNumber.replace(/\D/g, '');

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      mobileNumber: formattedMobile,
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return success (without sensitive data)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3600000,
      path: '/',
    });
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const getUserFromToken = async (req, res) => {
  try {
    console.log("Request received for /auth/getUser");
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      console.log("Verifying token with JWT_SECRET:", process.env.JWT_SECRET);
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    console.log("User query result:", user);
    if (!user) {
      console.log("User not found for ID:", decoded.userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Returning user data");
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getUserFromToken:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};