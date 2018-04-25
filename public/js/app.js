const app = angular.module('FlabApp', []);

////////////////////////////////////////////////////////////

//FLAB controller

////////////////////////////////////////////////////////////

app.controller('FlabController', ['$http', function($http){
  const controller = this;
  this.flabbiness = '{ Football Loving A**hole Beerdrinkers }';
  this.modal = false;
  this.aboutModal = false;
  this.toggleModal = function(){
    this.modal = !this.modal;
    this.aboutModal = !this.aboutModal;
    console.log('cuz everyone wants to know what FLAB is about');
  }


}]); //end of FlabController

////////////////////////////////////////////////////////////

//User controller

////////////////////////////////////////////////////////////

app.controller('UserController', ['$http', '$scope', function($http, $scope){
  const controller = this;
  this.modal = false;
  this.loggedIn = false;
  this.loginForm = true;
  this.registerForm = false;
  this.newDisplay = false;
  this.currentUser = {};


  this.toggleNew = function(){
    this.newDisplay = !this.newDisplay;
    this.reset = function() {
      this.addForm.reset();
    }
  }
  this.toggleModal = function(){
    this.modal = !this.modal;
  };
  this.toggleForms = function(){
    this.registerForm = !this.registerForm;
    this.loginForm = !this.loginForm;
  };
  //shouldn't the params be updated to username & password?
  this.register = function(email, username){
    $http({
      method: 'POST',
      url: '/users/register',
      data: {
        username: this.registeredUsername,
        password: this.registeredPassword
      }
    }).then(function(response){
      controller.loggedIn = response.data;
      controller.registerForm = false;
      console.log('new FLAB created');
    }, function(err){
      console.log(err);
    });
  };
  this.goToRegister = function(){
    this.registerForm = true;
    this.loginForm = false;
  };
  this.goToLogin = function(){
    this.loginForm = true;
    this.registerForm = false;
  };
  //ajax call to login
  this.login = function(username, password){
    $http({
      method: 'POST',
      url: '/users/login',
      data: {
        username: this.loginUsername,
        password: this.loginPassword
      }
    }).then(function(response){
      if(response.data === true){
      controller.loginForm = false;
      controller.loggedIn = response.data;
      controller.verifyLogin();
      console.log('verified user is logged in');

    } else {
      controller.message = response.data
    };
    }, function(err){
      console.log(err);
    });
  };

  //ajax call to logout a session
  this.logOut = function(){
    $http({
      method: 'GET',
      url: '/users/logout'
    }).then(function(response){
      controller.loggedIn = response.data;
      controller.loginForm = true;
      controller.username = {};
      console.log('user logged out');
    });
  };

  //ajax call to show all  the users
  this.getUsers = function(){
    $http({
      method: 'GET',
      url: '/users'
    }).then(function(response){
      //test this to see if commenting out  controller.allUsers will stop access of allUser in update user edit route
      controller.allUsers = response.data;
    }, function(err){
      console.log(err);
    });
  };

  this.verifyLogin = function(){
    $http({
      method: 'GET',
      url: '/users/verifyLogin'
    }).then(function(response){
      $scope.verifyFlab = response.data; //this is our current users

    }, function(err){
      console.log(err);
    });
  };

  //ajax call to identify a certain user by id
  this.setCurrentUser = function(id){
    $http({
      method: 'GET',
      url: '/users/' + id
    }).then(function(response){
      controller.currentUser = response.data[0]
      $scope.input = '';
    }, function(err){
      console.log(err);
    });
  };


  //this is where the issue is:
  //ajax call to update the user
  this.updateUser = function(id){
    console.log('works', id.allUsers[4]._id);
    // console.log("this is update user id", id);

    $http({
      method: 'PUT',
      url: '/users/' + id.allUsers[4]._id,
      data: this.editedUser
    }).then(function(response){
      controller.getUsers();
      controller.currentUser = {};
      controller.user = {};
      // adding this to see if I can grab user modal input
      controller.editedUser = {};
      // controller.editedUser._id = {};
    }, function(err){
      console.log(err);
      // console.log('error in update route');
    });
  };

  //ajax call to delete the user
  this.deleteUser = function(user){
    $http({
      method: 'DELETE',
      url: '/users/' + user,
    }).then(function(response){
      controller.getUsers();
      controller.modal = false;
      controller.logOut();
    }, function(err){
      console.log('user delete route error');
      console.log(err);
    });
  };
  this.getUsers();

}]); //end of UserController


////////////////////////////////////////////////////////////

//FlabbieProfile controller

////////////////////////////////////////////////////////////

app.controller('FlabbieController', ['$http', '$scope', function($http, $scope){
  const controller = this;
  this.modal = false;
  this.newDisplay = false;
  this.currentFlabbieProfile = {};
  this.commentedFlabbie = {};


  //create random lines like this w/credit to someecards.com:
  this.hasBestPicks = "Beating you at fantasy football would probably feel better if I wasn't beating you at everything else in life.";

  this.createFlabbieProfile = function(){
    console.log('create user profile being accessed');
    $http({
      method: 'POST',
      url: '/flabbie',
      data: {
        author: this.author,
        email: this.email,
        image: this.image,
        bio: this.bio,
        favoriteTeams: this.favoriteTeams,
        favoriteBeers: this.favoriteBeers
      }
    }).then(function(response){
      controller.newDisplay = false;
      controller.getFlabbieProfiles();  //render all FlabbieProfiles when new one is added
      console.log('FlabbieProfile was successfully created');
      console.log(response);
    }, function(err){
      console.log(err);
      console.log('error in createdFlabbieProfile');
    });
  }

  this.toggleNew = function(){
    console.log('toggle new FlabbieProfile being accessed');
    this.newDisplay = !this.newDisplay;
    this.reset = function() {
      this.addForm.reset();
    }
  }
  this.toggleModal = function(){
    this.modal = !this.modal;
    console.log('trying to get FlabbieProfile through toggleFlabbieProfileModal');
  };
  this.toggleComment = function(){
    this.commentDisplay = !this.commentDisplay;
  }
  this.addComment = function(id){
    $http({
      method: 'PUT',
      url: '/flabbie/comment/' + id,
      data: this.commentedFlabbie
    }).then(function(response){
      controller.commentDisplay = false;
      controller.commentedFlabbie = {};
      controller.getFlabbieProfiles();
    }, function(err){
      console.log(err);
      console.log('err in flabbie addComment');
    })
  }
  //ajax call to show all the user profiles
  this.getFlabbieProfiles = function(){
    console.log('getting FlabbieProfiles');
    $http({
      method: 'GET',
      url: '/flabbie',
    }).then(function(response){
      controller.allFlabbieProfiles = response.data;
      console.log(response);
    }, function(error){
      console.log('error in getFlabbieProfiles');
      console.log(err);
    });
  };

  this.setCurrentFlabbieProfile = function(id){  //grabbing it by id so it can //be edited in next function
    $http({
      method: 'GET',
        url: '/flabbie/' + id
    }).then(function(response){
        controller.currentFlabbieProfile = response.data[0];
        console.log(controller.currentFlabbieProfile);
        console.log(response);
        $scope.input = '';
        if($scope.verifyFlab.username !== controller.currentFlabbieProfile.author) {
          document.getElementById("flabItem").style.visibility = "hidden";
        }
    }, function(error){
      console.log(error);
      console.log('error in setCurrentFlabbieProfile');
    })
  }

  //ajax call to update the user
  this.updateFlabbieProfile = function(id){
    $http({
      method: 'PUT',
      url: '/flabbie/' + id,
      data: this.editedFlabbieProfile
    }).then(function(response){
      controller.getFlabbieProfiles();
      controller.editDisplay = false;
      controller.currentFlabbieProfile = {};
      controller.flabbie = {};
      controller.editedFlabbieProfile = {};
      // controller.editedFlabbie._id = {};
    }, function(err){
      console.log(err);
      console.log('error in update FlabbieProfile route');
    });
  };

  //ajax call to delete the user
  this.deleteFlabbieProfile = function(id){
    $http({
      method: 'DELETE',
      url: '/flabbie/' + id,
    }).then(function(response){
      controller.getFlabbieProfiles();
      controller.modal = false;
    }, function(err){
      console.log('FlabbieProfile delete route error');
      console.log(err);
    });
  };
  this.getFlabbieProfiles();

}]); //end of FlabbieProfileController

////////////////////////////////////////////////////////////

//Football controller

//will scrape game season schedule from ESPN site or utilize ESPN API

////////////////////////////////////////////////////////////

app.controller('FootballController', ['$http', '$scope', function($http, $scope){
  const controller = this;
  this.obsession = 'College Football is the SUPERIOR Sport';
  this.newDisplay = false;
  this.modal = false;
  this.currentFootballPost = {};
  this.commentedFootball = {};

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
        controller.newDisplay = false;
        controller.getFootballPosts();  //render all footballPosts when new one is added
        console.log(response);
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
  this.toggleComment = function(){
    this.commentDisplay = !this.commentDisplay;
  }
  this.addComment = function(id){
    $http({
      method: 'PUT',
      url: '/football/comment/' + id,
      data: this.commentedFootball
    }).then(function(response){
      controller.commentDisplay = false;
      controller.commentedFootball = {};
      //also get the author of the Comments
      controller.getFootballPosts();
    }, function(err){
      console.log(err);
      console.log('err in addComment in football');
    })
  }


  // AJAX/get request for Football Post index
  this.getFootballPosts = function(){
    $http({
      method:'GET',
      url: '/football',
    }).then(function(response){
      controller.allFootballPosts = response.data //value of a successful ajax request
    }, function(error){
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
      $scope.input = '';
      if($scope.verifyFlab.username !== controller.currentFootballPost.author)
      {
        document.getElementById("footballItem").style.visibility = "hidden";
      }

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

  this.deleteFootballPost = function(id){
    $http({
      method: 'DELETE',
      url: '/football/' + id,
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

app.controller('BeersController', ['$http', '$scope', function($http, $scope){
  const controller = this;
  this.suds = '..Are proof that God wants us to be happy!'
  this.newDisplay = false;
  this.currentBeerPost = {};
  this.modal = false;
  this.commentedBeer = {};
  this.dbBeer = [];

  this.getBreweryDBResponse = function(){
    $http({
      method: 'POST',
      url: '/beers/getBreweryDBResponse',
      data: {
        name: this.name
      }
    }).then(
      function(response){
        console.log('getBreweryDBResponse talking');
        for(let i = 0; i < (response.data).length; i++){
          response.data[i].name,
          response.data[i].description,
          response.data[i].foodPairings,
          response.data[i].styleId,
          response.data[i].labels,
          response.data[i].year
        }
        controller.breweryDBBeers = response.data;

      },
      function(error){
        console.log(error);
      }
    )
  }

  this.getBeers = function(){
    // console.log('getBeer called');
      $http({
        method: 'GET',
        url: '/beers',
      }).then(
        function(response){
                controller.beers=response.data
              },
              function(error){

              }
  )
}

  //         for(let i = 0; i < (response.data).length; i++){
  //         console.log(response, " this is response");
  //         response.data[i].name,
  //         response.data[i].styleId,
  //         response.data[i].description,
  //         response.data[i].year,
  //         response.data[i].withBreweries,
  //         response.data[i].foodPairings
  //       }
  //
  //       controller.dbBeer = response.data;
  //     },
  //       function(err) {
  //         console.log(err);
  //         console.log('err in getBeer');
  //       }
  //     )
  // }


  // this.postBeer = function() {
  //   console.log('postBeer called');
  //   const data = {
  //     name: controller.query
  //   }
  //
  // console.log(controller.query, 'post')
  //   $http({
  //     method: 'POST',
  //     url: '/beers',
  //     data: data
  //
  //   }).then(
  //     function(response){
  //       console.log(response, ' this is response from postBeer');
  //       controller.message = response.data.beer + " is " + response.data.name
  //     },
  //     function(err){
  //       console.log(err);
  //       console.log('err in postBeer');
  //     }
  //   );
  // }

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
          userRating: this.userRating,
          author: this.author
        }
      }).then(function(response){
        controller.newDisplay = false;
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
  this.toggleComment = function(){
    this.commentDisplay = !this.commentDisplay;
  }
  this.addComment = function(id){
    $http({
      method: 'PUT',
      url: '/beers/comment/' + id,
      data: this.commentedBeer
    }).then(function(response){
      controller.commentDisplay = false;
      controller.commentedBeer = {};
      //add custom directive to show who the author of the comment is?
      controller.getBeerPosts();
    }, function(err){
      console.log(err);
      console.log('err in addComment');
    })
  }

  // AJAX/get request for (beer post) index
  // this.getBeerPosts = function(){
  //   $http({
  //     method:'GET',
  //     url: '/beers',
  //   }).then(function(response){
  //     controller.allBeerPosts = response.data //value of a successful ajax request
  //     console.log(response);
  //   }, function(){
  //     console.log('error in getBeerPosts');
  //   });
  // }

  this.setCurrentBeerPost = function(id){ //so we can edit it in the next function
    $http({
      method: 'GET',
      url: '/beers/' + id
    }).then(function(response){
      controller.currentBeerPost = response.data[0];
      console.log(controller.currentBeerPost);
      $scope.input = '';
      if($scope.verifyFlab.username !== controller.currentBeerPost.author)
      {
        document.getElementById("beerItem").style.visibility = "hidden";
      }
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

  // this.postBeer(); //call immediately once controller is instantiated
this.getBeers();
}]); //end of BeersController


////////////////////////////////////////////////////////////

//Smack controller

//perhaps utilize 3rd party API for randomly appearing chuck norris smack content from https://github.com/chucknorris-io/chuck-api

////////////////////////////////////////////////////////////

app.controller('SmackController', ['$http', '$scope', function($http, $scope){
  const controller = this;
  //string below courtesy of https://api.chucknorris.io/jokes/9HfAFHoJQXGwWpKuFwv4yQ
  this.rivalry = "Ever notice just how much Chuck Norris' a**hole and your face resemble each other?";
  this.newDisplay = false;
  this.currentSmackPost = {};
  this.modal = false;
  this.commentedSmack = {};

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
        controller.newDisplay = false;
        controller.getSmackPosts();  //render all smackPosts when new one is added
        console.log('smack was successfully created');
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
  this.toggleEdit = function(){
      this.editDisplay = !this.editDisplay;
  }
  this.toggleModal = function(){
    this.modal = !this.modal;
    console.log('trying to get some smack through toggleModal');
  }
  this.toggleComment = function(){
    this.commentDisplay = !this.commentDisplay;
  }
  this.addComment = function(id){
    $http({
      method: 'PUT',
      url: '/smack/comment/' + id,
      data: this.commentedSmack
    }).then(function(response){
      controller.commentDisplay = false;
      controller.commentedSmack = {};
      controller.getSmackPosts();
    }, function(err){
      console.log(err);
      console.log('err in addComment for smack');
    })
  }

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

  //Neo is The One, the one after Chuck Norris.
  this.setCurrentSmackPost = function(id){ //so we can edit it in the next function
    $http({
      method: 'GET',
      url: '/smack/' + id
    }).then(function(response){
      controller.currentSmackPost = response.data[0];
      console.log(controller.currentSmackPost);
      $scope.input = '';
      if($scope.verifyFlab.username !== controller.currentSmackPost.author)
      {
        document.getElementById("smackItem").style.visibility = "hidden";
      }
    }, function(error){
      console.log('error in setCurrentSmackPost');
    })
  }

  //ajax call to update smackPost... b/c sometimes.... smack needs to be edited..
  this.updateSmackPost = function(id){
    $http({
      method:'PUT',
      url: '/smack/' + id,
      data: this.editedSmackPost
    }).then(function(response){
      controller.getSmackPosts();
      //is this really necessary?: ...is smack really necessary?
      controller.editDisplay = false;
      controller.currentSmackPost = {};
      controller.smack = {};
      controller.editedSmackPost = {};
    }, function(){
      console.log('error in updateSmackPost');
    });
  }

  //ajax call to delete that smack... Chuck Norris invented this w/his fists
  this.deleteSmackPost = function(id){
    $http({
      method: 'DELETE',
      url: '/smack/' + id,
    }).then(function(response){
      controller.getSmackPosts();
      controller.modal = false;
    }, function(err) {
      console.log('error in deleteSmackPost');
    }
  );
  }

  this.getSmackPosts();
}]); //end of SmackController
