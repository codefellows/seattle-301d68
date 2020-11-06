'use strict';

// 3rd party dependencies
const express = require('express');

// application constants
const app = express();
const PORT = process.env.PORT || 3000;

// this allows express to server "static files"
app.use(express.static('./public'));

// SERVER ROUTE
app.get('/about-us', (request, response) => {
  response.send('i am the about us webpage');
});

// SERVER ROUTE - simply "serves" a webpage
app.get('/', (request, response) => {
  response.sendFile('./public/index.html');
});

// API ROUTE - this is data that can be used to power our page (ie: programming interface)
app.get('/api/cats/coolcat', (request, response) => {
  response.json({ cat: { name: 'cool cat', age: 30 } })
});

// sets up access for incoming traffic on a port of 3000
app.listen(PORT, () => {
  console.log('server up on port 3000');
});