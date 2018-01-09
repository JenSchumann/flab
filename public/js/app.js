const app = angular.module('FlabApp', []);

app.controller('FlabController', ['$http', function($http){
  this.flab = '{ Football Loving A**hole Beerdrinkers }';

}]); //end of FlabController

app.controller('BeersController', ['$http', function($http){
  const controller = this;

  this.createBeerPost = function(){
      $http({
        method: 'POST',
        url: 'http://localhost:3000/beers',
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

  this.getBeerPosts = function(){
    $http({
      method:'GET',
      url: 'http://localhost:3000/beers',
    }).then(function(response){
      controller.beers = response.data //value of a successful ajax request
    }, function(){
      console.log('error in getBeerPosts');
    });
  };

  this.updateBeerPost = function(beer){
    $http({
      method:'PUT',
      url: 'http://localhost:3000/beers/' + beer._id,
      data: {
        beer: newBeer.name,
        beer: newBeer.type,
        beer: newBeer.ingredients,
        beer: newBeer.abv,
        beer: newBeer.ibu,
        beer: newBeer.brewery,
        beer: newBeer.purchaseLocation,
        beer: newBeer.userRating
      }
    }).then(function(response){
      controller.getBeerPosts();
    }, function(){
      console.log('error in updateBeerPost');
    });
  }

  this.getBeerPosts; //call immediately once controller is instantiated

}]); //end of BeersController
