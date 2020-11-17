'use strict';

// 3rd party npm packages
const express = require('express');
const dotenv = require('dotenv');
const pg = require('pg');
const app = express();

// reads project specific env variables from a .env file
dotenv.config();

// sets up app constants
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

// connects to our DB
client.connect();
client.on('error', err => console.err(err));

// server and application configuration
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', getTasks);
app.get('/tasks/:task_id', getOneTask);
app.get('/add', showForm);
app.post('/add', addTask);

function getOneTask(req, res) {
  let SQL = 'SELECT * FROM tasks WHERE id=$1';
  let values = [req.params.task_id];

  return client.query(SQL, values)
    .then(result => {
      return res.render('pages/detail-view', { task: result.rows[0] })
    });
}

function getTasks(req, res) {
  // TODO: read from the DB all of our tasks, send back to client in a page
  let SQL = 'SELECT * FROM tasks;';

  return client.query(SQL)
    .then(results => res.render('index', { results: results.rows }))
    .catch(err => console.error(err));
}

function addTask(req, res) {
  // helper: console.log(req.body) -> the req body contains your form data
  // NOTE: read more about object destructuring
  let { title, description, category, contact } = req.body;
  let SQL = 'INSERT INTO tasks(title, description, category, contact) VALUES ($1, $2, $3, $4);';
  let values = [title, description, category, contact];

  return client.query(SQL, values)
    .then(res.redirect('/'))
    .catch(err => console.error(err));

}

function showForm(req, res) {
  res.render('pages/add-view');
}

// listens for incoming traffic
app.listen(PORT, () => {
  console.log(`server up: ${PORT}`);
});