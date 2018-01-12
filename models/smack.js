const mongoose = require('mongoose');

const smackSchema = mongoose.Schema({
  smackTitle: String,
  author: { type:String, default:'' },
  img: String,
  smackdown: String,
  tag: String
});

const Smack = mongoose.model('Smack', smackSchema)


//exports
module.exports = Smack;





//add likes, comments to this schema in next stage of developmemt


// I am tired of hearing about Coach Harbaugh; I think he needs to get in check with reality because, at the end of the day, you can't talk smack about a rivalry when you haven't won a rivalry game. You got to win ballgames to be able to talk behind it. Ezekiel Elliott
// Read more at: https://www.brainyquote.com/quotes/ezekiel_elliott_811643?src=t_smack
