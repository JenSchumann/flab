//dependencies
const mongoose = require('mongoose');
// const Beer = require('./beers.js');
const Football = require('./football.js');
const Smack = require('./smack.js');
const Flabbie = require('./flabbie.js');


//Schema
const userSchema = mongoose.Schema({

  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // beers: [Beer.schema],
  beers: [],
  football: [Football.schema],
  smack: [Smack.schema],
  flabbie: [Flabbie.schema]
});


const User = mongoose.model('User', userSchema);


//export
module.exports = User;
