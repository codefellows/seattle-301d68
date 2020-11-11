'use strict';

require('dotenv').config();

const express = require('express');
const pg = require('pg'); // connector and set of tools between our server and our DB
const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);

// this adds a person to our DB, given their first/last names in the query string
app.get('/add', (req, res) => {
  let first = req.query.first;
  let last = req.query.last;

  // entire purpose of this route is to get a first/last name of a person (off the query string)
  // and to save that person to our database
  let SQL = 'INSERT INTO people (first_name, last_name) VALUES ($1, $2) RETURNING *';
  let values = [first, last];

  client.query(SQL, values)
    .then( results => {
      console.log('this is the raw object we get back:', results.rows);
      res.status(201).json(results.rows);
    })
    .catch( err => {
      res.status(500).send(err);
    })
});

app.get('/people', (req, res) => {
  let SQL = 'SELECT * FROM people';

  client.query(SQL)
    .then(data => {
      res.json(data.rows);
    })
    .catch(err => console.error(err));
});

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server up!  ${PORT}`);
    });
  })
  .catch(err => console.log(err));
