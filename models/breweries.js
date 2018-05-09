const mongoose = require('mongoose');

const brewerySchema = mongoose.Schema({
  name: {type: String, unique: true , required: true},
  description: {type: String},
  location: { type: String },  
  tapRoom: { type: Boolean}
});

const Brewery = mongoose.model("Brewery", brewerySchema);
module.exports = Brewery;
