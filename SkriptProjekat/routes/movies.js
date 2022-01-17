const {Movie, validate} = require('../models/movie'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const admin = require('../authentication/admin');
const auth = require('../authentication/auth');
const moderator = require('../authentication/moderator');

router.get('/', [auth, (moderator || admin)], async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.post('/', [auth, (moderator || admin)], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
      return res.status(400).send(error.details[0].message);
    }

  let movie = new Movie({ 
    title: req.body.title,
    year_of_release: req.body.year_of_release,
    rating: req.body.rating,
    isTrending: req.body.isTrending,
    length_in_minutes: req.body.length_in_minutes
  });

  movie = await movie.save();
  res.send(movie);
});

router.put('/:id', [auth, (moderator || admin)], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const movie = await Movie.findByIdAndUpdate(req.params.id, { 
    title: req.body.title,
    year_of_release: req.body.year_of_release,
    rating: req.body.rating,
    isTrending: req.body.isTrending,
    length_in_minutes: req.body.length_in_minutes
    },{
      new: true
    }).select('-__v');  
  
  if (!movie) {
      return res.status(404).send('Not found movie.');
    }

  res.send(movie);
});

router.delete('/:id', [auth, (moderator || admin)], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
  
  if (!movie) {
      return res.status(404).send('Not found movie');
    }
  
    res.send(movie);
  });
  
  router.get('/:id', [auth, (moderator || admin)], async (req, res) => {
    const movie = await Movie.findById(req.params.id);
  
    if (!movie) {
        return res.status(404).send('Not found movie');
      }
  
    res.send(movie);
  });

module.exports = router; 