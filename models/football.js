const mongoose = require('mongoose');

const footballSchema = mongoose.Schema({
  postTitle: String,
  author: { type:String, default:'' },
  fbPost: String,
  tag: String,
  url: String
});

const Football = mongoose.model('Football', footballSchema)


//exports
module.exports = Football;
















//words I'm considering regarding this model:
// upsets, overtime, traditions, rankings, special teams, offense, defense, coach, quarterback, recruiting, freshman, senior, mascot, media, conference, heisman, fans, championships, touchdowns, turnovers, rivalries, corso, icons, legends, records, draft, season, training, plays, drives, playoffs

//inspired by FLAB interaction and CFB game watching and also this article:
//http://bleacherreport.com/articles/1174002-50-things-we-just-love-about-college-football
