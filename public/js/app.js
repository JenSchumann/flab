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
        console.log(response);
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

  this.getBeerPosts; //call immediately once controller is instantiated
  
}]); //end of BeersController
