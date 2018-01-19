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
  Smack.create(req.body, function(err, createdSmack){
    res.json(createdSmack);
  });
});

//update route
router.put('/:id', function(req, res){
  Smack.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedSmack){
    res.json(updatedSmack);
  });
});

//delete route
router.delete('/:id', function(req, res){
  Smack.findByIdAndRemove(req.params.id, function(err, deletedSmack){
    res.json(deletedSmack);
  });
});

module.exports = router;
