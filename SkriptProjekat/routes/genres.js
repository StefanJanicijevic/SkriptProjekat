const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const admin = require('../authentication/admin');
const auth = require('../authentication/auth');
const moderator = require('../authentication/moderator');

router.get('/', [auth, (moderator || admin)], async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.post('/', [auth, (moderator || admin)], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
      return res.status(400).send(error.details[0].message);
    }

  let genre = new Genre({
    name: req.body.name,
    number_of_movie: req.body.number_of_movie,
    isExclusive: req.body.isExclusive,
    price_of_genre: req.body.price_of_genre,
    category: req.body.category
  });

  genre = await genre.save();
  res.send(genre);
});

router.put('/:id', [auth, (moderator || admin)], async (req, res) => {
    const { error } = validate(req.body); 
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    
  const genre = await Genre.findByIdAndUpdate(req.params.id, { 
    name: req.body.name,
    number_of_movie: req.body.number_of_movie,
    isExclusive: req.body.isExclusive,
    price_of_genre: req.body.price_of_genre,
    category: req.body.category
    },
    {
      new: true
    }).select('-__v');

  if (!genre) {
      return res.status(404).send('Not found genre.');
    }

  res.send(genre);
});

router.delete('/:id', [auth, (moderator || admin)], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
      return res.status(404).send('Genre with this id not found');
    }

  res.send(genre);
});

router.get('/:id', [auth, (moderator || admin)], async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
      return res.status(404).send('Genre with this id not found.');
    }

  res.send(genre);
});



module.exports = router;