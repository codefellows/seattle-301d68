'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3333;

// the 3 following JS lines are simply required - put these in your server
// otherwise, you will not be able to serve "static" files to the client
// there is no public directory, but we will need this later
app.use(express.static('./public'));

// always put this if server any file to the client
app.use(express.urlencoded({ extended: true }));

// this connects us to our server side view library
app.set('view engine', 'ejs');

// TODO: build out routes that will send the user "pages"
app.get('/', renderHomePage); // this will send back our homepage html and content
app.get('/searches/new', showForm);
app.post('/searches', createSearch); // this will create a new search to the Google Books API

function renderHomePage(req, res) {
  res.render('pages/index'); // now we are sending you a final rendered page
}

function showForm(req, res) {
  res.render('pages/searches/new.ejs');
}

function createSearch(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  // console.log('req body:', req.body);

  if(req.body.search[1] === 'title') { url += `+intitle:${req.body.search[0]}`; }
  if(req.body.search[1] === 'author') { url += `+inauthor:${req.body.search[0]}`; }

  console.log(url);

  superagent.get(url)
    .then(data => {
      return data.body.items.map(book => {
        // console.log(book.volumeInfo);
        return new Book(book.volumeInfo);
      });
    })
    .then(results => {
      res.render('pages/show', { searchResults: JSON.stringify(results) });
    })
    .catch(err => console.error(err));
}

function Book(info) {
  this.title = info.title || 'no title avail';
}


app.listen(PORT, () => {
  console.log(`server up:::  ${PORT}`);
});