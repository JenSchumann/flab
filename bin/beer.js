const request = require('request');

const apiKey = process.env.API_KEY

const getBeer = (res, name) => {

  const responseToFlab = (res, data) => {
    res.send(data)
  }

  request("http://api.brewerydb.com/v2/?key=" + apiKey, function(error, response, body) {

    const parsedBody = JSON.parse(body)
    responseToFlab(res, body)
    console.log(parsedBody.beer, parsedBody.name)

  });
}

module.exports = getBeer;
