//dependencies
const express = require('express');
const mongoose = require('mongoose');
const app = express();


//controllers
const beersController = require('./controllers/beers.js');
app.use('/beers', beersController);

//index route
app.get('/', function(req, res) {
  res.render('index.ejs');
});
















//mongoose connection
mongoose.connect('mongodb://localhost:27017/flab');
mongoose.connection.once('open', function(){
  console.log('FLAB connected to mongoose...');
});



//port
app.listen(3000, function(){
  console.log('FLAB is listening...');
});
