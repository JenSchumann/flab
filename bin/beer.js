const request = require('request');

const apiKey = process.env.API_KEY

//this line throws an error:
// const client = breweryDB.client(apiKey);

const getBreweryDBResponse = (res, name, body) => {

  let breweryDBResponse = [];

  client.search({
    name: name
  }).then(response => {
    for(let i = 0; i < (response.jsonBody.beers).length; i++) {
    breweryDBResponse.push(
    {
      name: response.jsonBody.beers[i].name, description: response.jsonBody.beers[i].description, foodPairings: response.jsonBody.beers[i].foodPairings, styleId: response.jsonBody.beers[i].styleId, labels: response.jsonBody.beers[i].labels, year: response.jsonBody.beers[i].year}
        )
      }
      console.log(breweryDBResponse);
      res.send(breweryDBResponse)
        }).catch(e => {
          console.log(e);
        });

}

module.exports = getBreweryDBResponse;
