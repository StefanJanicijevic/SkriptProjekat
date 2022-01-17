const Joi = require('joi');
const mongoose = require('mongoose');

const tvshowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    minlength: 2,
    maxlength: 30
  },
  number_of_seasons: { 
    type: Number,  
    required: true,
    min: 1,
  },
  number_of_episodes: { 
    type: Number, 
    required: true,
    min: 1,
  },
  revenue: {
    type: Number, 
    required: true,
    min: 1000000,
  },
  category: {
    type: String,
    require: true,
    enum: ['anime', 'cartoon','real-life', 'all']
  } 
});

const Tvshow = mongoose.model('TVshows', tvshowSchema);


function validateMovie(tvshow) {
  const schema = {
    title: Joi.string().min(2).max(30).required(),
    number_of_seasons: Joi.number().min(1).required(),
    number_of_episodes: Joi.number().min(1).required(),
    revenue: Joi.number().min(1000000).required(),
    category: Joi.string().required(),
  };

  return Joi.validate(tvshow, schema);
}

exports.Tvshow = Tvshow; 
exports.validate = validateMovie;