const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 20,
    },
    number_of_movie: {
      type: Number,
      require: true,
      min: 0,
      max: 1000
    },
    isExclusive: {
      type: Boolean,
      require: true,
    },
    price_of_genre: {
      type: Number,
      require: true,
      min: 0,
      max: 100
    },
    category: {
      type: String,
      require: true,
      enum: ['kids', 'adults', 'all']
    } 
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(2).max(20).required(),
      number_of_movie: Joi.number().min(0).max(1000).required(),
      isExclusive: Joi.boolean().required(),
      price_of_genre: Joi.number().min(0).max(100).required(),
      category: Joi.string().required()
    };
  
    return Joi.validate(genre, schema);
  }

exports.genreSchema = genreSchema;
exports.Genre = Genre; 
exports.validate = validateGenre;