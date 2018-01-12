const mongoose = require('mongoose');

const smackSchema = mongoose.Schema({
  smackTitle: String,
  author: { type:String, default:'' },
  smackdown: String,
  tag: String
});

const Smack = mongoose.model('Smack', smackSchema)


//exports
module.exports = Football;





//add likes, comments to this schema in next stage of developmemt
