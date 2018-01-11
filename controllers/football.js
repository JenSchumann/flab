const express = require('express');
const router = express.Router();
const Football = require('../models/football.js');


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
  Football.create(req.body, function(err, createdFootball){
    res.json(createdFootball);
  });
});

//update route
router.put('/:id', function(req, res){
  Football.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedFootball){
    res.json(updatedFootball);
  });
});

//delete route
router.delete('/:id', function(req, res){
  Football.findByIdAndRemove(req.params.id, function(err, deletedFootball){
    res.json(deletedFootball);
  });
});

module.exports = router;
