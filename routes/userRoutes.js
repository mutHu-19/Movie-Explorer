// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  deleteFavourites,
  getFavourites,
  saveFavourite
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

router.get('/:username/favorites', getFavourites);
router.post('/:username/favorites', saveFavourite);
router.delete('/:username/favorites/:id', deleteFavourites);

module.exports = router;
