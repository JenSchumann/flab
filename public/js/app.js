const app = angular.module('FlabApp', []);

app.controller('FlabController', ['$http', function($http){
  const controller = this;
  this.flab = '{ Football Loving A**hole Beerdrinkers }';

}]); //end of FlabController

////////////////////////////////////////////////////////////

//Football controller

//will scrape game season schedule from ESPN site or

//researching for possible 3rd party API to integrate... possibly this one:
// https://github.com/akeaswaran/cfb-scoreboard-api

////////////////////////////////////////////////////////////

app.controller('FootballController', ['$http', function($http){
  const controller = this;
  this.obsession = 'College Football is the SUPERIOR Sport';
  this.newDisplay = false;
  this.modal = false;
  // this.currentFootballPost = {};


  this.createFootballPost = function(){
      $http({
        method: 'POST',
        url: '/football',
        data: {
          postTitle: this.postTitle,
          author: this.author,
          fbPost: this.fbPost,
          tag: this.tag,
          url: this.url
        }
      }).then(function(response){
        controller.getFootballPosts();  //render all footballPosts when new one is added
        //console.log(response);
      }, function(){
        console.log('error in createFootballPost');
      });
  }

  this.toggleNew = function(){
    this.newDisplay = !this.newDisplay;
    this.reset = function() {
      this.addForm.reset();
    }
  }
  this.toggleModal = function(){
    this.modal = !this.modal;
    console.log('toggling to access football post');
  }


  // AJAX/get request for Football Post index
  this.getFootballPosts = function(){
    $http({
      method:'GET',
      url: '/football',
    }).then(function(response){
      controller.allFootballPosts = response.data //value of a successful ajax request
    }, function(){
      console.log('error in getFootballPosts');
    });
  }

  this.setCurrentFootballPost = function(id){  //grabbing it by id so it can //be edited in next function
    $http({
      method: 'GET',
      url: '/football/' + id
    }).then(function(response){
      controller.currentFootballPost = response.data[0];
      console.log(controller.currentFootballPost);

      // add angular hidden custom directive to check user w/football post // author to determine whether edit functions are visible in html

    }, function(error){
      console.log('error in setCurrentFootballPost');
    })
  }

  //ajax call to update footballPost
  this.updateFootballPost = function(id){
    $http({
      method:'PUT',
      url: '/football/' + id,
      data: this.editedFootballPost
    }).then(function(response){
      controller.getFootballPosts();
      controller.editDisplay = false;
      controller.currentFootballPost = {};
      controller.football = {};
      controller.editedFootballPost = {};
    }, function(){
      console.log('error in updateBeerPost');
    });
  }

  this.deleteFootballPost = function(football){
    $http({
      method: 'DELETE',
      url: '/football/' + football,
    }).then(function(response){
      controller.getFootballPosts();
      controller.modal = false;
    }, function(err) {
      console.log('error in deleteFootballPost');
    }
  );
  }
  this.getFootballPosts();

}]);  //end of FootballController




////////////////////////////////////////////////////////////

//Beer controller

//will add 3rd party API functionality in near future from:
// http://www.brewerydb.com/developers/docs-endpoint/beer_index

////////////////////////////////////////////////////////////

app.controller('BeersController', ['$http', function($http){
  const controller = this;
  this.suds = '..Are proof that God wants us to be happy!'
  this.newDisplay = false;
  this.currentBeerPost = {};
  this.modal = false;

  this.createBeerPost = function(){
      $http({
        method: 'POST',
        url: '/beers',
        data: {
          name: this.name,
          type: this.type,
          ingredients: this.ingredients,
          abv: this.abv,
          ibu: this.ibu,
          brewery: this.brewery,
          purchaseLocation: this.purchaseLocation,
          userRating: this.userRating
        }
      }).then(function(response){
        controller.getBeerPosts();  //render all beerPosts when new one is added
        // console.log(response);
      }, function(){
        console.log('error');
      });
  }

  this.toggleNew = function(){
    this.newDisplay = !this.newDisplay;
    //check if this works:
    this.reset = function() {
      this.addForm.reset();
    }
  }
  this.toggleEdit = function(){
      this.editDisplay = !this.editDisplay;
    }
    this.toggleModal = function(){
      this.modal = !this.modal;
      console.log('trying to get one beer post accessed through toggleModal');
    }

  // AJAX/get request for (beer post) index
  this.getBeerPosts = function(){
    $http({
      method:'GET',
      url: '/beers',
    }).then(function(response){
      controller.allBeerPosts = response.data //value of a successful ajax request
    }, function(){
      console.log('error in getBeerPosts');
    });
  }

  this.setCurrentBeerPost = function(id){ //so we can edit it in the next function
    $http({
      method: 'GET',
      url: '/beers/' + id
    }).then(function(response){
      controller.currentBeerPost = response.data[0];
      console.log(controller.currentBeerPost);

      // add once user MODEL is fleshed out (w/express-session):
      // $scope.input = '';
      // $scope.checkUser.email !== controller.currentBeerPost.author
      // with a conditional to hide the tab 2 "beerEdit" id using
      // document.getElementById
    }, function(error){
      console.log('error in setCurrentBeerPost');
    })
  }

  //ajax call to update beerPost
  this.updateBeerPost = function(id){
    $http({
      method:'PUT',
      url: '/beers/' + id,
      data: this.editedBeerPost
    }).then(function(response){
      controller.getBeerPosts();
      //is this really necessary?:
      controller.editDisplay = false;
      controller.currentBeerPost = {};
      controller.beer = {};
      controller.editedBeerPost = {};
    }, function(){
      console.log('error in updateBeerPost');
    });
  }

  this.deleteBeerPost = function(beer){
    $http({
      method: 'DELETE',
      url: '/beers/' + beer,
    }).then(function(response){
      controller.getBeerPosts();
      controller.modal = false;
    }, function(err) {
      console.log('error in deleteBeerPost');
    }
  );
  }

  this.getBeerPosts(); //call immediately once controller is instantiated

}]); //end of BeersController


////////////////////////////////////////////////////////////

//Smack controller

//perhaps utilize 3rd party API for randomly appearing chuck norris smack content from https://github.com/chucknorris-io/chuck-api

////////////////////////////////////////////////////////////

app.controller('SmackController', ['$http', function($http){
  const controller = this;
  //string below courtesy of https://api.chucknorris.io/jokes/9HfAFHoJQXGwWpKuFwv4yQ
  this.rivalry = "Ever notice just how much Chuck Norris' a**hole and your face resemble each other?";
  this.newDisplay = false;
  this.currentSmackPost = {};
  this.modal = false;

  this.createSmackPost = function(){
      $http({
        method: 'POST',
        url: '/smack',
        data: {
          smackTitle: this.smackTitle,
          img: this.img,
          smackdown: this.smackdown,
          tag: this.tag
        }
      }).then(function(response){
        controller.getSmackPosts();  //render all smackPosts when new one is added
        console.log(response);
      }, function(){
        console.log('error in createSmackPost');
      });
  }

  this.toggleNew = function(){
    this.newDisplay = !this.newDisplay;
    this.reset = function() {
      this.addForm.reset();
    }
  }

  this.toggleModal = function(){
    this.modal = !this.modal;
    console.log('trying to get some smack through toggleModal');
  }


  //still needs the RUD of crud below for smack..
  //and in case you're wondering: Neo is The One, the one after Chuck Norris.

  // AJAX/get request for (smack post) index
  this.getSmackPosts = function(){
    $http({
      method:'GET',
      url: '/smack',
    }).then(function(response){
      controller.allSmackPosts = response.data //value of a successful ajax request
    }, function(){
      console.log('error in getSmackPosts');
    });
  }

  this.setCurrentSmackPost = function(id){ //so we can edit it in the next function
    $http({
      method: 'GET',
      url: '/smack/' + id
    }).then(function(response){
      controller.currentSmackPost = response.data[0];
      console.log(controller.currentSmackPost);

      // add once user MODEL is fleshed out (w/express-session):
      // $scope.input = '';
      // $scope.checkUser.email !== controller.currentSmackPost.author
      // with a conditional to hide the tab 2 "smackEdit" id using
      // document.getElementById
    }, function(error){
      console.log('error in setCurrentSmackPost');
    })
  }

  this.getSmackPosts();
}]); //end of SmackController
