const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  name: String,
  style: String,
  description: String,
  // ingredients: String,
  // abv: String,
  // ibu: Number,
  brewery: String,
  labels: String,
  // purchaseLocation: String,
  userRating: Number,
  author: {type:String, default: ''},
  comments: [{ type: String }]
});

const Beers = mongoose.model('Beers', beerSchema);

module.exports = Beers;
