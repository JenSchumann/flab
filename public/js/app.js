const app = angular.module('FlabApp', []);

////////////////////////////////////////////////////////////

//FLAB controller

////////////////////////////////////////////////////////////

app.controller('FlabController', ['$http', function($http){
  const controller = this;
  this.flabbiness = '{ Football Loving A**hole Beerdrinkers }';
  this.modal = false;
  this.aboutModal = false
  this.showBeerPage = false;
  this.toggleModal = function(){
    this.modal = !this.modal;
    this.aboutModal = !this.aboutModal;
    console.log('cuz everyone wants to know what FLAB is about');
  }

  $('.nav li a').on('click',function(event){
          // console.log(event);
          event.preventDefault();
          var target = $(this).attr('href');
          // console.log(target);
          var offsetTop = $(target).offset().top;
          $('html, body').animate({
            scrollTop: offsetTop
          },1000);
        });

      this.openBeerSearch = function(){
      this.showBeerPage = true;
      console.log('currentUser in app.js: ', currentUser);  // testing purpose
   };

}]); //end of FlabController

////////////////////////////////////////////////////////////

//BeerDBController controller

////////////////////////////////////////////////////////////

app.controller('BeerDBController', ['$http', '$scope', function($http, $scope){

  const controller = this;
  this.beers = [];
  this.selectedBeer = "";
  this.foundNoBeers = false;
  this.searchForBeer = "";
  this.searchByBrewery = "";

  // Clears the text boxes and sets the beer list to an empty array
  this.clearSearchForm = function() {
    controller.searchForBeer = "";
    controller.beers = [];
    this.searchByBrewery = "";
    this.foundNoBeers = false;
  }

  this.capWords = function(breweryName) {
    if (breweryName === "") {
      return breweryName;
    }

    var words = breweryName.split(" ");
    for (var i = 0; i < words.length; i++) {
      var curWord = words[i];
      var firstLetter = curWord.charAt(0).toUpperCase();
      curWord = firstLetter + curWord.slice(1);
      words[i] = curWord;
    }
    return words.join(" ");
  }

  // Takes the results of a search and puts the data into objects that match
  // the mongo model. Adds the beers to the beer list.
  this.addFoundBeersToList = function(data) {
    for (var i = 0; i < data.length; i++ ) {
      var newBeer = {
        name: data[i].name,
        description: data[i].description,
        style: data[i].style.shortName,
        abv: data[i].abv,
        ibu: data[i].ibu,
        brewery: this.capWords( this.searchByBrewery)
      }
      controller.beers.push(newBeer);
    }
  }

  // Called when beer search form is submitted
  // Search by name has priority over search by brewery
  this.findBeer = function() {
    if (this.searchForBeer !== "") {
      this.searchByBrewery = ""
      this.getBeerByName();
    } else if (this.searchByBrewery !== "") {
      this.getBeersByBrewery();
    }
  }

  // Gets beer by name from brewerydb. Gets brewery that makes the beer.
  this.getBeerByName = function() {
    var urlStr = '/breweries/proxy/v2/beers?name=' + controller.searchForBeer;

    $http({
      method: 'GET',
      url: urlStr
    }).then( function(response) {
      controller.beers = [];

      // check if beer was found
      if (response.data.hasOwnProperty('data')) {
        controller.foundNoBeers = false;
      }
      else {
        controller.foundNoBeers = true;
        return;
      }

      controller.addFoundBeersToList(response.data.data);
      controller.getBreweryByBeerID(response.data.data[0].id);
      console.log(controller.beers);
    }, function(response) {
      console.log("Get beer by name failed", response);
      controller.beers = [];
    }
  )};

  this.goToThisBeer = function(breweryId, main){
      main.showBrewerySearch = false;
      main.showLoginForm = false;
      main.showHomePage = false;
      main.showBeerPage = false;
      main.showBreweryPage = false;
      main.showBreweries = false;
      BeerDisplayController.showDetailsForm = true;
   //   this.getBeerByName(breweryId);
   var urlStr = '/breweries/proxy/v2/beers?name=' + controller.searchForBeer;

   $http({
     method: 'GET',
     url: urlStr
   }).then( function(response) {
     controller.beers = [];
     // check if beer was found
     if (response.data.hasOwnProperty('data')) {
       controller.foundNoBeers = false;
       this.thisOneBeer = response;
       console.log(response);
     }
     else {
       controller.foundNoBeers = true;
       return;
     }
  });
 };

  // Get the brewery that makes the beer using the brewerydb beer id
  this.getBreweryByBeerID = function(beerID) {
    var urlStr = "/breweries/proxy/v2/beer/" + beerID + "/breweries";

    $http({
      method: 'GET',
      url: urlStr
    }).then( function(response) {
      if (response.data.hasOwnProperty('data') === true) {
        controller.beers[0].brewery = response.data.data[0].name;
      }
    }, function(response) {
      console.log("getBreweryByBeerID failed:", response);
    }
  )};


  // Get all of the beers that a brewery makes. Search by brewery name
  this.getBeersByBrewery = function() {
    controller.beers = [];
    var urlStr = "/breweries/proxy/v2/breweries?name=" + controller.searchByBrewery;

    $http({
      method: 'GET',
      url: urlStr
    }).then( function(response) {
      if (response.data.hasOwnProperty('data')) {
        controller.getBreweryBeers(response.data.data[0].id);
      }
    }, function(response) {
      console.log("getBeersByBrewery failed", response);
    })
  }

  // Get the beers a brewery makes. Search for brewery by breweryDB brewery id
  this.getBreweryBeers = function(breweryID) {
    var urlStr = "/breweries/proxy/v2/brewery/" + breweryID + "/beers";

    $http({
      method: 'GET',
      url: urlStr
    }).then(function(response) {
      if (response.data.hasOwnProperty('data')) {
        controller.foundNoBeers = false;
      } else {
        controller.foundNoBeers = true;
        return;
      }
      controller.addFoundBeersToList(response.data.data);
    }, function(response) {
      console.log("getBreweryBeers failed:", response);
    })
  }

  // save beer as a favorite
  this.saveFavoriteBeer = function() {
    var urlStr = '/users/beers/' + currentUser._id;

    $http({
      method: 'PUT',
      url: urlStr,
      data: {beers:  this.selectedBeer }
    }).then(function(response) {
      console.log("beer saved as favorite");
    }, function(response) {
      console.log("saveFavoriteBeer failed: ", response);
    })
    window.location.reload();
  }

}]); //end of BeerDBController

////////////////////////////////////////////////////////////

//User controller

////////////////////////////////////////////////////////////

app.controller('BeerDisplayController', ['$http', '$scope', function($http, $scope){
  this.showSearchForm = true;
  this.showDetailsForm = false;
  this.showAddFavButton = false;


  this.showDetails = function(ctrl, curBeer) {
    this.showSearchForm = false;
    this.showDetailsForm = true;
    ctrl.selectedBeer = curBeer;
    // need to create conditional to show add beer button if user is logged in

  };

  this.backToSearchForm = function(){
    this.showDetailsForm = false;
    this.showSearchForm = true;
  };
}]);

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
      // console.log(response);
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

////////////////////////////////////////////////////////////

app.controller('BeersController', ['$http', '$scope', function($http, $scope){
  const controller = this;
  this.suds = '..Are proof that God wants us to be happy!'
  this.newDisplay = false;
  this.currentBeerPost = {};
  this.modal = false;
  this.commentedBeer = {};
  this.dbBeer = [];

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
  // this.addComment = function(id){
  //   $http({
  //     method: 'PUT',
  //     url: '/beers/comment/' + id,
  //     data: this.commentedBeer
  //   }).then(function(response){
  //     controller.commentDisplay = false;
  //     controller.commentedBeer = {};
  //     //add custom directive to show who the author of the comment is?
  //     controller.getBeerPosts();
  //   }, function(err){
  //     console.log(err);
  //     console.log('err in addComment');
  //   })
  // }

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
