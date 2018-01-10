const express = require('express');
const router = express.Router();
const Beers = require('../models/beers.js');


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
  Beers.create(req.body, function(err, createdBeer){
    res.json(createdBeer);
  });
});

//update route
router.put('/:id', function(req, res){
  Beers.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedBeer){
    res.json(updatedBeer);
  });
});


//delete route
router.delete('/:id', function(req, res){
  Beers.findByIdAndRemove(req.params.id, function(err, deletedBeer){
    res.json(deletedBeer);
  })
})


module.exports = router;
