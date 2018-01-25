const express = require('express');
const router = express.Router();
const Flabbie = require('../models/flabbie.js');
const User = require('../models/user.js')


//index route
router.get('/', function(req, res){
  Flabbie.find({}, function(err, foundFlabbie){
    res.json(foundFlabbie);
  });
});

//show route
router.get('/:id', (req, res)=> {
  Flabbie.find({_id : req.params.id }, function(err, foundFlabbie){
    res.send(foundFlabbie);
  });
});

//create route
router.post('/', function(req, res){
  req.body.author = req.session.username;
  Flabbie.create(req.body, (err, createdFlabbie)=>{
    User.findOneAndUpdate(
      { username: req.session.username },
      { $push: {flabbie: createdFlabbie}},
      { safe: true, upsert: true, new: true},
      (err, model)=>{
        console.log(err);
      })
    res.json(createdFlabbie);
  });
});

//update route
router.put('/:id', function(req, res){
  Flabbie.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedFlabbie)=> {
    User.findOneAndUpdate(
      { username: req.session.username},
      { $set: { Flabbie: updatedFlabbie}},
      { safe: true, upsert: true, new: true },
      (err, model)=> {
        console.log(err);
      })
      res.json(updatedFlabbie)
  });
});


//delete route
router.delete('/:id', function(req, res){
  Flabbie.findByIdAndRemove(req.params.id, (err, deletedFlabbie)=>{
    User.findOne({ username: req.session.username}, (err, foundUser)=> {
      foundUser.Flabbie.id(req.params.id).remove();
      foundUser.save((err, data)=> {
        res.json(deletedFlabbie);
      })
    });
  });
});


module.exports = router;
