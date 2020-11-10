'use strict';

const express = require('express');
const superagent = require('superagent');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const ZOMATO_API_KEY = process.env.ZOMATO_API_KEY;

app.use(cors()); // this is considered 3rd party middleware

// we are going to use two 3rd party APIs to power our own API today:
// LocationIQ API -> this gives us lat/lon/city information
// Zomato API -> gives back restaurants in a specific lat/lon
app.get('/location', handleLocation);
app.get('/restaurants', handleRestaurants);

app.get('*', notFoundHandler); // "catch all" route should be at the bottom of the file/after all route definitions

function handleLocation(req, res) {
  // this will make a request to the locationIQ api (location info)
  let city = req.query.city;
  let url = `http://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json&limit=1`;
  let locations = {};

  // this is called caching - we will review tomorrow/thur -> try to figure out
  // what this is doing...  -> caching is tangential to todays main focus -> which is retrieving data from
  // a 3rd party API

  if(locations[url]) {
    res.send(locations[url]);
  } else {
    superagent.get(url)
    .then(data => {
      const geoData = data.body[0];
      const location = new Location(city, geoData);
      locations[url] = location;

      console.log('visited locations:', locations);
      res.json(location);
    })
    .catch(() => {
      console.error('did not work');
    })
  }
}

function handleRestaurants(req, res) {
  // this will take our location data and make a request to the Zomato API (restaurant info)
  const url = 'https://developers.zomato.com/api/v2.1/geocode';
  const queryParams = {
    lat: req.query.latitude,
    lng: req.query.longitude
  }

  superagent.get(url)
    .query(queryParams)
    .set('user-key', ZOMATO_API_KEY)
    .then(data => {
      const results = data.body;
      const restaurantData = [];

      results.nearby_restaurants.forEach(item => {
        restaurantData.push(new Restaurant(item));
      });

      res.json(restaurantData);
    })
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function Restaurant(entry) {
  this.restaurant = entry.restaurant.name;
  this.cuisines = entry.restaurant.cuisines;
  this.locality = entry.restaurant.location.locality;
}

function notFoundHandler(req, res) {
  res.status(404).send('not found');
}

app.listen(PORT, () => {
  console.log(`server up: ${PORT}`);
});