const {Tvshow, validate} = require('../models/tvshow'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const admin = require('../authentication/admin');
const auth = require('../authentication/auth');
const moderator = require('../authentication/moderator');

router.get('/', [auth, (moderator || admin)],  async (req, res) => {
  const tvshow = await Tvshow.find().sort('name');
  res.send(tvshow);
});

router.post('/', [auth, (moderator || admin)], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
      return res.status(400).send(error.details[0].message);
    }

  let tvshow = new Tvshow({ 
    title: req.body.title,
    number_of_seasons: req.body.number_of_seasons,
    number_of_episodes: req.body.number_of_episodes,
    revenue: req.body.revenue,
    category: req.body.category
  });

  tvshow = await tvshow.save();
  res.send(tvshow);
});

router.put('/:id', [auth, (moderator || admin)], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const tvshow = await Tvshow.findByIdAndUpdate(req.params.id, { 
    title: req.body.title,
    number_of_seasons: req.body.number_of_seasons,
    number_of_episodes: req.body.number_of_episodes,
    revenue: req.body.revenue,
    category: req.body.category
    },{
      new: true
    }).select('-__v');  
  
  if (!tvshow) {
      return res.status(404).send('TVShow not found');
    }

  res.send(tvshow);
});

router.delete('/:id', [auth, (moderator || admin)], async (req, res) => {
    const tvshow = await Tvshow.findByIdAndRemove(req.params.id);
  
  if (!tvshow) {
      return res.status(404).send('TVShow not found');
    }
  
    res.send(tvshow);
  });
  
  router.get('/:id', [auth, (moderator || admin)], async (req, res) => {
    const tvshow = await Tvshow.findById(req.params.id);
  
    if (!tvshow) {
        return res.status(404).send('TVShow not found');
      }
  
    res.send(tvshow);
  });

module.exports = router; 