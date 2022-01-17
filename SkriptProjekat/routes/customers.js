const {Customer, validate} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const admin = require('../authentication/admin');
const auth = require('../authentication/auth');
const moderator = require('../authentication/moderator');



router.get('/', [auth, (moderator || admin)], async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});   

router.post('/', [auth, (moderator || admin)], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
      return res.status(400).send(error.details[0].message);
    }

  let customer = new Customer({ 
    name: req.body.name,
    phone: req.body.phone,
    isPremium: req.body.isPremium,
    address: req.body.address,
    email: req.body.email
  });
  customer = await customer.save();
  
  res.send(customer);
});

router.put('/:id', [auth, (moderator || admin)], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) {
      return res.status(400).send(error.details[0].message);
    }

  const customer = await Customer.findByIdAndUpdate(req.params.id, { 
    name: req.body.name,
    phone: req.body.phone,
    isPremium: req.body.isPremium,
    address: req.body.address,
    email: req.body.email
  },{
      new: true
  }).select('-__v');

  if (!customer) {
      return res.status(404).send('Not found customer');
    }

  res.send(customer);
});

router.delete('/:id', [auth, (moderator || admin)], async (req, res) => {

  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
        return res.status(404).send('Customer with this id not found');
    }

  res.send(customer);
});

router.get('/:id', [auth, (moderator || admin)], async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
      return res.status(404).send('Customer with this id not found');
    }
    
  res.send(customer);
});

module.exports = router; 