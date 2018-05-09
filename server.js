//dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');


const methodOverride = require('method-override');
const env = require('dotenv').config();

//middleware
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.json());

//controllers
// const beersController = require('./controllers/beers.js');
// app.use('/beers', beersController);

const footballController = require('./controllers/football.js');
app.use('/football', footballController);

const smackController = require('./controllers/smack.js');
app.use('/smack', smackController);

const userController = require('./controllers/users.js');
app.use('/users', userController);

const flabbieController = require('./controllers/flabbie.js');
app.use('/flabbie', flabbieController);

//breweries section
const breweriesController = require('./controllers/breweries.js')
app.use ('/breweries', breweriesController);

// Fixes mongoose promise deprecation warning
// mongoose.Promise = global.Promise;










//mongoose connection
mongoose.connect('mongodb://localhost:27017/flab');
mongoose.connection.once('open', function(){
  console.log('FLAB connected to mongoose...');
});



//port
app.listen(3000, function(){
  console.log('FLAB is listening...');
});
