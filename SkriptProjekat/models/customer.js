const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  phone: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30
  },
  isPremium: {
    type: Boolean,
    required: true
  },
  address: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    unique: true
  }
});

const Customer = mongoose.model('Customer', customerSchema);


function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
    phone: Joi.string().min(6).max(30).required(),
    isPremium: Joi.boolean(),
    address: Joi.string().min(6).max(30).required(),
    email: Joi.string().min(5).max(100).required().email()
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;