//dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')
const env = require('dotenv').config()

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}))


//controllers
const beersController = require('./controllers/beers.js');
app.use('/beers', beersController);

const footballController = require('./controllers/football.js');
app.use('/football', footballController);

const smackController = require('./controllers/smack.js');
app.use('/smack', smackController);

const userController = require('./controllers/users.js');
app.use('/users', userController);

//add FlabController... for nav.html?












//mongoose connection
mongoose.connect('mongodb://localhost:27017/flab');
mongoose.connection.once('open', function(){
  console.log('FLAB connected to mongoose...');
});



//port
app.listen(3000, function(){
  console.log('FLAB is listening...');
});
