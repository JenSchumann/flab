const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  name: String,
  type: String,
  ingredients: String,
  abv: String,
  ibu: Number,
  brewery: String,
  purchaseLocation: String,
  userRating: Number
});

const Beers = mongoose.model('Beer', beerSchema);

module.exports = Beers;
