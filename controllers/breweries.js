const proxy = require('express-http-proxy');
const express = require('express');
const router = express.Router();
const Breweries = require('../models/breweries.js');

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
  console.log('create new Brewery', req.body);
  Breweries.create(req.body, function (err, createdBrewery){
    res.json(createdBrewery);
  });
});

//update record
router.put('/:id', function(req, res){
  Breweries.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, udpatedBrewery){
    if(err) {console.log(err);}
    res.json(udpatedBrewery);
  });
});

// delete record
router.delete('/:id', function(req, res){
  Breweries.findByIdAndRemove(req.params.id, function(err, deletedBrewery){
    res.json(deletedBrewery);
  });
});

//breweries index page : for testing purpose
router.get('/', function(req, res){
  res.send('List  All Brewery here');
});

module.exports  = router;
