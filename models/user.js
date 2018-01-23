//dependencies
const mongoose = require('mongoose');
const Beer = require('./beers.js');
const Football = require('./football.js');
const Smack = require('./smack.js');
const UserProfile = require('./userProfile.js');


//Schema
const userSchema = mongoose.Schema({

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  beers: [Beer.schema],
  football: [Football.schema],
  smack: [Smack.schema],
  userProfile: [UserProfile.schema]
});


const User = mongoose.model('User', userSchema);


//export
module.exports = User;
