const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1500
  },
  isAdmin: {
      type: Boolean,
      default: false
  },
  isModerator: { 
    type: Boolean,
    default: false
  },
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, isModerator: this.isModerator }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().max(30).required(),
    last_name: Joi.string().max(30).required(),
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(8).max(1500).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;