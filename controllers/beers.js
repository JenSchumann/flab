// const express = require('express');
// const router = express.Router();
// const Beers = require('../models/beers.js');
// const User = require('../models/user.js');
// const getBreweryDBResponse = require('../bin/beer.js');


// module.exports = router;


const proxy = require('express-http-proxy');
const express = require('express');
const router = express.Router();
const Beers = require('../models/beers.js');

// 3rd party apis need to be accessed through a proxy
// if this is deleted requests to brewerydb will fail
router.use('/proxy', proxy('api.brewerydb.com' ,{
  proxyReqPathResolver: function(req) {
    var newUrl = require('url').parse(req.url).path;
    var connector = newUrl.includes("?") ? "&" : "?";
    const apiKey = process.env.API_KEY;
    return newUrl + connector + "key="+apiKey
  }
}))

router.post('/', function(req, res){
  console.log('create new Beer', req.body);
  Beers.create(req.body, function (err, createdBeer){
    res.json(createdBeer);
  });
});

//update record
router.put('/:id', function(req, res){
  Beers.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, udpatedBeer){
    if(err) {console.log(err);}
    res.json(udpatedBeer);
  });
});

// delete record
router.delete('/:id', function(req, res){
  Beer.findByIdAndRemove(req.params.id, function(err, deletedBeer){
    res.json(deletedBeer);
  });
});

//breweries index page : for testing purpose
router.get('/', function(req, res){
  res.send('List  All Beers here');
});

module.exports  = router;
