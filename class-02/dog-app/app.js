'use strict';

function Dog(dog) {
  this.name = dog.name;
  this.image_url = dog.image_url;
  this.hobbies = dog.hobbies;
}

Dog.prototype.render = function() {
  // selection
  let $dogClone = $('.template').clone();

  $('main').append($dogClone);

  // traversal & manipulation
  $dogClone.find('h2').text(this.name);
  $dogClone.find('img').attr('src', this.image_url);
  $dogClone.find('p').text(this.hobbies);

  // TODO: study and read more into this before lab
  $dogClone.removeClass('template');
}

// a custom instance method to read the contents of a JSON file
Dog.readJson = () => {
  const ajaxSettings = { method: 'get', dataType: 'json' };

  // go read the contents of our json file
  // for fun, plug this in and log it:
  // http://pokeapi.co/api/v2/pokemon
  // also, google the stars wars version
  $.ajax('data.json', ajaxSettings) // $.ajax -> go get our 'data.json' file
    .then(data => {
      // then take the "data" from that json file and do stuff with it
      console.log('our array of dog objects:', data);

      // and loop through each object (dog) in our array of dogs
      // create a new dog object (for each one)
      // and put that dog and it's related template code on the page
      // data.forEach(item => {
      //   let dog = new Dog(item);
      //   dog.render();
      // })
    })
}

// TODO: look at this pattern & the pattern of using "document ready"
$(() => Dog.readJson());