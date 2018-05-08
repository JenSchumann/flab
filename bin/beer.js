const request = require('request');

const apiKey = process.env.API_KEY;

let beerResponse = {};

function getBreweryDBResponse(){
              // var searchTerm = document.getElementById('searchBreweryDB').value;

              searchTerm = encodeURIComponent(searchTerm);
              var url = 'http://api.brewerydb.com/v2/search/?beerId&key=e2cf6d182fcd977a76875b349ab92f69&q='+searchTerm;
              getJSON(url,function(response){

                 console.log(response.data);
                 beerResponse = response.data;
                 // buildPage();
              })
          }

          function getJSON(url,callback){
                      var xhr = new XMLHttpRequest();
                      xhr.open('get',url,true);
                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.responseType = 'json';
                        xhr.onload = function(){
                            if(xhr.status ==200){
                                callback(xhr.response)
                            }
                        }
                        xhr.send();
                    }












// const getBreweryDBResponse = (res, name, body) => {
//
//   let breweryDBResponse = [];
//
//   client.search({
//
//     name: name
//   }).then(response => {
//     for(let i = 0; i < (response.jsonBody.beers).length; i++) {
//     breweryDBResponse.push(
//     {
//       name: response.jsonBody.beers[i].name, description: response.jsonBody.beers[i].description, foodPairings: response.jsonBody.beers[i].foodPairings, styleId: response.jsonBody.beers[i].styleId, labels: response.jsonBody.beers[i].labels, year: response.jsonBody.beers[i].year}
//         )
//       }
//       console.log(breweryDBResponse);
//       res.send(breweryDBResponse)
//         }).catch(e => {
//           console.log(e);
//         });
//
// }

module.exports = getBreweryDBResponse;
