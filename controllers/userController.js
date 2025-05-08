const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const {readFavourites, writeFavourites} = require('../utils/storage.js');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: "New User registered!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message:  `${user.username} you have login successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user (protected route)
exports.getProfile = async (req, res) => {
  res.json(req.user);
};


// Save favourite movie
exports.saveFavourite = (req, res) => {
    const { username } = req.params;
    const movie = req.body;
  
    const favorites = readFavourites();
  
    if (!favorites[username]) {
      favorites[username] = [];
    }
  
    const alreadyExists = favorites[username].some(m => m.id === movie.id);
  
    if (alreadyExists) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }
  
    favorites[username].push(movie);
    writeFavourites(favorites);
  
    res.json({ message: 'Movie added to favorites' });
  };
  
  // Get favourite movies
  exports.getFavourites = (req, res) => {
    const { username } = req.params;
    const favorites = readFavourites();
    res.json(favorites[username] || []);
  };
  
  // Remove a favourite
  exports.deleteFavourites = (req, res) => {
    const { username, id } = req.params;
    const favorites = readFavourites();
  
    if (!favorites[username]) {
      return res.status(404).json({
        message: `No favorites found for user ${username}`
      });
    }
  
    favorites[username] = favorites[username].filter(movie => movie.id !== parseInt(id));
    writeFavourites(favorites);
  
    res.json({
      message: 'Movie removed from favorites'
    });
  };