const express = require('express');
const router = express.Router();
const Beers = require('../models/beers.js');
const User = require('../models/user.js')


//index route
router.get('/', function(req, res){
  Beers.find({}, function(err, foundBeers){
    res.json(foundBeers);
  });
});

//show route
router.get('/:id', (req, res)=> {
  Beers.find({_id : req.params.id }, function(err, foundBeer){
    res.send(foundBeer);
  });
});

//create route
router.post('/', function(req, res){
  req.body.author = req.session.email;
  Beers.create(req.body, (err, createdBeer)=>{
    User.findOneAndUpdate(
      { email: req.session.email },
      { $push: {beers: createdBeer}},
      { safe: true, upsert: true, new: true},
      (err, model)=>{
        console.log(err);
      })
    res.json(createdBeer);
  });
});

//update route
router.put('/:id', (req, res)=>{
  Beers.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedBeer)=> {
    User.findOneAndUpdate(
      { email: req.session.email},
      { $set: { beers: updatedBeer}},
      { safe: true, upsert: true, new: true },
      (err, model)=> {
        console.log(err);
      })
      res.json(updatedBeer)
  });
});


//delete route
router.delete('/:id', (req, res)=>{
  Beers.findByIdAndRemove(req.params.id, (err, deletedBeer)=>{
    User.findOne({ email: req.session.email}, (err, foundUser)=> {
      foundUser.beers.id(req.params.id).remove();
      foundUser.save((err, data)=> {
        res.json(deletedBeer);
      })
    });
  });
});


module.exports = router;
