//dependencies
const mongoose = require('mongoose');


//Schema
const flabbieSchema = mongoose.Schema({
  author: {type:String, default: ''},
  email: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  bio: { type: String, default: '' },
  favoriteTeams: String,
  favoriteBeers: String

});


const Flabbie = mongoose.model('Flabbie', flabbieSchema);


//export
module.exports = Flabbie;
