const express = require('express');
const router = express.Router();
const Beers = require('../models/beers.js');
const User = require('../models/user.js');
const getBreweryDBResponse = require('../bin/beer.js');


//index route to 3rd party API (BreweryDB)
router.get('/', (req, res) =>{
  getBeer(res, 'fat tire')
})

//
router.post('/', (req, res) =>{
  console.log(req.body.name, 'req.body')

  getBeer(res, req.body.name)
})

//check to see if this is working
router.post('/getBeer', (req, res) => {
  console.log('req.body: ', req.body);
  getBeer(res, 'beer', req.body);
});


//index route
// router.get('/', function(req, res){
//   Beers.find({}, function(err, foundBeers){
//     res.json(foundBeers);
//   });
// });

//show route
router.get('/:id', (req, res)=> {
  Beers.find({_id : req.params.id }, function(err, foundBeer){
    res.send(foundBeer);
  });
});

//create route
router.post('/', function(req, res){
  req.body.author = req.session.username;
  Beers.create(req.body, (err, createdBeer)=>{
    User.findOneAndUpdate(
      { username: req.session.username },
      { $push: {beers: createdBeer}},
      { safe: true, upsert: true, new: true},
      (err, model)=>{
        console.log(err);
      })
    res.json(createdBeer);
  });
});

// new comment route
router.put('/comment/:id', (req, res)=>{
  Beers.findByIdAndUpdate(req.params.id, {$push: {comments: req.body.comments}}, (err, updatedBeer) => {
    res.json(updatedBeer);
  });
});

//update route
router.put('/:id', (req, res)=>{
  Beers.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedBeer)=> {
    User.findOneAndUpdate(
      { username: req.session.username},
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
    User.findOne({ username: req.session.username}, (err, foundUser)=> {
      foundUser.beers.id(req.params.id).remove();
      foundUser.save((err, data)=> {
        res.json(deletedBeer);
      })
    });
  });
});

//  BreweryDB Response route ==========================================

router.post('/getBreweryDBResponse', (req, res) => {
  console.log('req.body: ', req.body);
  getBreweryDBResponse(res, 'beers', req.body);
});

module.exports = router;
