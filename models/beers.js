const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  description: String
})


const beer = mongoose.model('Beer', beerSchema);

module.exports = beer;
