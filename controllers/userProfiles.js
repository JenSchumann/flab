const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile.js');
const User = require('../models/user.js')


//index route
router.get('/', function(req, res){
  UserProfile.find({}, function(err, foundUserProfiles){
    res.json(foundUserProfiles);
  });
});

//show route
router.get('/:id', (req, res)=> {
  UserProfile.find({_id : req.params.id }, function(err, foundUserProfile){
    res.send(foundUserProfile);
  });
});

//create route
router.post('/', function(req, res){
  req.body.author = req.session.email;
  UserProfile.create(req.body, (err, createdUserProfile)=>{
    User.findOneAndUpdate(
      { email: req.session.email },
      { $push: {userProfile: createdUserProfile}},
      { safe: true, upsert: true, new: true},
      (err, model)=>{
        console.log(err);
      })
    res.json(createdUserProfile);
  });
});

//update route
router.put('/:id', function(req, res){
  UserProfile.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedUserProfile)=> {
    User.findOneAndUpdate(
      { email: req.session.email},
      { $set: { userProfile: updatedUserProfile}},
      { safe: true, upsert: true, new: true },
      (err, model)=> {
        console.log(err);
      })
      res.json(updatedUserProfile)
  });
});


//delete route
router.delete('/:id', function(req, res){
  UserProfile.findByIdAndRemove(req.params.id, (err, deletedUserProfile)=>{
    User.findOne({ email: req.session.email}, (err, foundUser)=> {
      foundUser.userProfile.id(req.params.id).remove();
      foundUser.save((err, data)=> {
        res.json(deletedUserProfile);
      })
    });
  });
});


module.exports = router;
