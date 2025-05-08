const express = require('express');
const router = express.Router();
const {getMovieDetails, searchMovies, getTrending} = require("../controllers/tmbdController.js");

router.get('/trending',getTrending);
router.get('/search',searchMovies);
router.get('/movie/:id',getMovieDetails);

module.exports = router;
