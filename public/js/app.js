const app = angular.module('FlabApp', []);

app.controller('FlabController', ['$http', function($http){
  const controller = this;
  this.flab = '{ Football Loving A**hole Beerdrinkers }';

}]); //end of FlabController


////////////////////////////////////////////////////////////

//Beer controller

//will add 3rd party API functionality in near future from:
// http://www.brewerydb.com/developers/docs-endpoint/beer_index

////////////////////////////////////////////////////////////

app.controller('BeersController', ['$http', function($http){
  const controller = this;
  this.newDisplay = false;
  this.currentBeerPost = {};
  this.modal = false;

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
