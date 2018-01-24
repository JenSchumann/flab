const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

//index route to all users //need to flesh out an admin user for this functionality in the future
router.get('/', (req, res)=> {
  User.find({}, (err, foundUsers)=> {
    res.json(foundUsers);
  });
});

//login verification route
router.get('/verifyLogin', (req, res)=> {
  if(req.session.logged) {
    User.findOne({ email: req.session.email}, (err, user)=> {
      res.json(user)
    });
  } else {
          req.session.message = "email or password are incorrect";
          res.json(req.session.message)
  };
});

//register new user - post route
router.post('/register', (req, res)=>{
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const userDbEntry = {};
  userDbEntry.email = req.body.email;
  userDbEntry.password = passwordHash;
  User.create(userDbEntry, (err, user)=> {
    req.session.message = '';
    req.session.email = user.email;
    req.session.logged = true;
    res.json(req.session.logged);
  });
});

//create user profile => changed '/' to '/createUserProfile'
// router.post('/createUserProfile', function(req, res){
//   User.create(req.body, function(err, createUserProfile){
//     res.json(createUserProfile);
//   });
// });

//login user - post route
router.post('/login', (req, res)=> {
  User.findOne({ email: req.body.email }, (err, user)=> {
    if(user){
      if(bcrypt.compareSync(req.body.password, user.password)){
        req.session.message = '';
        req.session.email = req.body.email;
        req.session.logged = true;
        res.json(req.session.logged);
      } else {
        req.session.message = "Incorrect Email &/or Password";
        res.json(req.session.message);
      }
    } else {
      req.session.message = "Incorrect Email &/or Password";
      res.json(req.session.message);
    }
  });
});

//logout user route
router.get('/logout', (req, res)=> {
  req.session.destroy(function(err){
    req.session = false;
    console.log('User Logged Out');
    res.json(req.session);
  });
});

//show route.... need to figure out user will "see" their profile ==> user icon on nav if logged in leads to user modal?
router.get('/:id', (req, res)=> {
  User.find({ _id: req.params.id }, function(err, foundUser)
  {
    res.json(foundUser)
  });
});

//edit route
router.get('/verifyLogin', (req, res)=> {
  if(req.session.logged){
    User.findOne({ email: req.session.email }, (err, user)=> {
      res.json(updatedUser);
    });
  } else {
    console.log('get route to verifyLogin for edit');
  };
});

// need to verify that this is working properly
router.put('/:verifyLogin', (req, res)=> {
  if(req.session.logged){
    User.findByIdAndUpdate(req.params.id, req.body, { new: true },
    (err, user)=> {
      console.log('updated user profile');
      res.json(updatedUser);
    });
  } else {
    res.send('error');
    console.log('error in put/:verifyLogin');
  };
});

//delete user route
router.delete('/:id', (req, res)=> {
  User.findByIdAndRemove(req.params.id, (err, deletedUser)=> {
    res.json(deletedUser);
  });
});


module.exports = router;
