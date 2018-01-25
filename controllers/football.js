const express = require('express');
const router = express.Router();
const Football = require('../models/football.js');
const User = require('../models/user.js')


//index route
router.get('/', function(req, res){
  Football.find({}, function(err, foundFootball){
    res.json(foundFootball);
  });
});

//show route
router.get('/:id', (req, res)=>{
  Football.find({_id : req.params.id }, function(err, foundFootball){
    res.send(foundFootball);
  });
});

//create route
router.post('/', function(req, res){
  req.body.author = req.session.username;
  Football.create(req.body, (err, createdFootball)=>{
    User.findOneAndUpdate(
      { username: req.session.username },
      { $push: {football: createdFootball}},
      { safe: true, upsert: true, new: true},
      (err, model)=>{
        console.log(err);
      })
    res.json(createdFootball);
  });
});

//update route
router.put('/:id', function(req, res){
  Football.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedFootball)=>{
    User.findOneAndUpdate(
      { username: req.session.username},
      { $set: { football: updatedFootball}},
      { safe: true, upsert: true, new: true },
      (err, model)=> {
        console.log(err);
      })
      res.json(updatedFootball)
  });
});

//delete route
router.delete('/:id', function(req, res){
  Football.findByIdAndRemove(req.params.id, (err, deletedFootball)=>{
    User.findOne({ username: req.session.username}, (err, foundUser)=> {
      foundUser.football.id(req.params.id).remove();
      foundUser.save((err, data)=> {
        res.json(deletedFootball);
      })
    });
  });
});

module.exports = router;
