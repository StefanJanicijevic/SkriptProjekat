const Joi = require('joi');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    minlength: 2,
    maxlength: 30
  },
  year_of_release: { 
    type: Number,  
    required: true,
    min: 1900,
    max: 2022
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10
  },
  isTrending: {
    type: Boolean,
    require: true,
  },
  length_in_minutes: {
    type: Number, 
    required: true,
    min: 0,
  }
});

const Movie = mongoose.model('Movies', movieSchema);


function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(2).max(30).required(),
    year_of_release: Joi.number().min(1900).max(2022).required(),
    rating: Joi.number().min(1).max(10).required(),
    isTrending: Joi.boolean().required(),
    length_in_minutes: Joi.number().min(0).required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie; 
exports.validate = validateMovie;