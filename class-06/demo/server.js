'use strict';

require('dotenv').config();
// the above is the same things as:

// const dotenv = require('dotenv');
// dotenv.config();

// require 3rd party dependencies (npm === 3rd party)
const express = require('express');
const cors = require('cors');

// setup "app" constants (constants for my server file)
const app = express();
const PORT = process.env.PORT || 3000;

// all this does is OPEN our API for public access
app.use(cors());

app.get('/location', handleLocation);

// named route handler vs. below in our examples we have unnamed (anonymous) callback functions
function handleLocation(request, response) {
  try {
    // tomorrow we will actually "req" this location data from a geo location API
    let geoData = require('./data/location.json');
    // this is extra info in the form of a querystring (key/val pair) in the url
    let city = request.query.city;
    // format a url with qs like this: http://localhost:3000/location?city=seattle&county=king

    // create an object that only contains location data we care about - this should
    // be an instance of the type of data we are looking for
    let locationData = new Location(city, geoData);
    response.send(locationData);
  } catch (error) {
    console.error(error);
  }
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// ::::::::::::  EXAMPLE & LECTURE DISCUSSION ROUTES  ::::::::::::::: //

// generic server route -> meant to "serve" a page or static content cool
app.get('/webpage', (request, response) => {
  // build a response
  response.send('cool website');
});

// NOTE: normally we do not have this but it's good to see how ERRORs are handled
app.get('/example-error', (request, response) => {
  // go data from somewhere
  // couldn't get data - something happenend
  // so, send error to user
  throw new Error('couldnt access info');
});

// ::::::::::::  END:  EXAMPLE & LECTURE DISCUSSION ROUTES  ::::::::::::::: //

// 404 - not found route - this lives at the bottom of your route definitions (aka catch all route)
app.use('*', (request, response) => {
  response.status(404).send('sorry, not found!');
})

// setup your server on a PORT to accept incoming traffic
app.listen(PORT, () => {
  console.log(`server up: ${PORT}`);
})