const express = require('express');
const router = express.Router();
const Smack = require('../models/smack.js');
const User = require('../models/user.js')


//index route
router.get('/', function(req, res){
  Smack.find({}, function(err, foundSmack){
    res.json(foundSmack);
  });
});

//show route
router.get('/:id', (req, res)=> {
  Smack.find({_id : req.params.id }, function(err, foundSmack){
    res.send(foundSmack);
  });
});

//create route
router.post('/', function(req, res){
  req.body.author = req.session.username;
  Smack.create(req.body, (err, createdSmack)=>{
    User.findOneAndUpdate(
      { username: req.session.username },
      { $push: {smack: createdSmack}},
      { safe: true, upsert: true, new: true},
      (err, model)=>{
        console.log(err);
      })
    res.json(createdSmack);
  });
});

//new comment route
router.put('/comment/:id', (req, res)=>{
  Smack.findByIdAndUpdate(req.params.id, {$push: {comments: req.body.comments}}, (err, updatedSmack) => {
    res.json(updatedSmack);
  });
});

//update route
router.put('/:id', function(req, res){
  Smack.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedSmack)=>{
    User.findOneAndUpdate(
      { username: req.session.username},
      { $set: { smack: updatedSmack}},
      { safe: true, upsert: true, new: true },
      (err, model)=> {
        console.log(err);
      })
      res.json(updatedSmack)
  });
});

//delete route
router.delete('/:id', function(req, res){
  Smack.findByIdAndRemove(req.params.id, (err, deletedSmack)=>{
    User.findOne({ username: req.session.username}, (err, foundUser)=> {
      foundUser.smack.id(req.params.id).remove();
      foundUser.save((err, data)=> {
        res.json(deletedSmack);
      })
    });
  });
});


module.exports = router;
