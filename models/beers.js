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

const Beers = mongoose.model('Beers', beerSchema);

module.exports = Beers;
