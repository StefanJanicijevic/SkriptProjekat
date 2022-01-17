const auth = require('../authentication/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const lodash = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const admin = require('../authentication/admin');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/register', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send('User already registered.');
  }

  user = new User(lodash.pick(req.body, ['name', 'last_name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  
  
  const token = user.generateAuthToken();
  res.header('auth-token', token).send(lodash.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', auth, admin, async (req, res) => {
    // const { error } = validate(req.body); 
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }
    
  const user = await User.findByIdAndUpdate(req.params.id, { 
    name: req.body.name
    },
    {
      new: true
    }).select('-__v');

  if (!user) {
      return res.status(404).send('Not found user.');
    }

  res.send(user);
});


router.delete('/:id', auth, admin, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

if (!user) {
    return res.status(404).send('User not found');
  }

  res.send(user);
});

module.exports = router; 
