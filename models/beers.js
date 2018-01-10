const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  name: String,
  type: String,
  ingredients: String,
  abv: String,
  ibu: Number,
  brewery: String,
  purchaseLocation: String,
  userRating: Number,
  author: {type:String, default: ''}
});

const Beers = mongoose.model('Beer', beerSchema);

module.exports = Beers;
