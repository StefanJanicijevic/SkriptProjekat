const mongoose = require ('mongoose');
const Joi = require('joi');
const config = require('config');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const tvshows = require('./routes/tvshows');
const auth = require('./routes/auth');
const users = require('./routes/users');
const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

if(!config.get('jwtPrivateKey')) {
    console.error('Error: No JWT tokens provided');
    process.exit(1);
}

mongoose.connect("mongodb://localhost:27017/skript", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error: cant connect'));

app.use(express.json());
app.use('/admin/genres', genres);
app.use('/admin/customers', customers);
app.use('/admin/movies', movies);
app.use('/admin/tvshows', tvshows);
app.use('/admin/users', users);
app.use('/admin/auth', auth);

app.listen(8000);



// mongoose.connect('mongodb://localhost/skript')
//     .then(() => console.log('Connected'))
//     .catch(err => console.log('Error: cant connect'));