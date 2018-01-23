//dependencies
const mongoose = require('mongoose');


//Schema
const userProfileSchema = mongoose.Schema({
  name: String,
  image: { type: String, default: '' },
  bio: { type: String, default: '' },
  favoriteTeams: String,
  favoriteBeers: String

});


const UserProfile = mongoose.model('UserProfile', userProfileSchema);


//export
module.exports = UserProfile;
