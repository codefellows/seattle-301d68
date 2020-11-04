'use strict';

let places = [];

function Neighborhood(rawDataObject) {
  // "for in" loop -> for property in object
  for (let key in rawDataObject) {
    this[key] = rawDataObject[key];
  }
}

// NOTE: the above is a "better" / more programmatic pattern for this
// function Neighborhood(obj) {
//   this.name = obj.name;
//   this.city = obj.city;
//   this.population = obj.population;
//   this.founded = obj.founded;
//   this.body = obj.body
// }

Neighborhood.prototype.toHtml = function() {
  // in here, we are going to use mustache to grab, compile, create, and render
  // our content to the page

  // 1. Get ("grab") the template from our index.html file
  let template = $('#neighborhood-template').html();

  // 2. Use mustache to "render" new html - by merging the template with our actual data
  let html = Mustache.render(template, this);

  // 3. return our final rendered/completed HTML so we can stick it on the page
  return html;
}

// loop through our "static"/"hardcoded" array of neighborhood objects
// and create a new object (hence the Neighborhood constructor) which now
// has a method for rendering to HTML and push that to an array that we can access (places = array)
neighborhoodDataSet.forEach(place => {
  places.push(new Neighborhood(place));
});

console.log('places array', places);

// then go through our newly created nieghborhood objects and for each one, render it to the page
places.forEach(place => {
  console.log('my place', place);

  $('#neighborhoods').append(place.toHtml());
})