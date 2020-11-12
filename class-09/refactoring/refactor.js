'use strict';

// function declaration
function Person(name, age) {
  this.name = name;
  this.age = age; 
}

// prototype method (aka use it when you need it)
Person.prototype.getName = function() {
  return this.name;
}

let brian = new Person('Brian', 35);

// this is not as good as it could be
// this references "person" over and over again
function sayName(person) {
  if (person.age >= 35) {
    return person.getName().toUpperCase();
  } else {
    return person.getName().toLowerCase();
  }
}

function sayNameBetter(person) {
  let name = person.getName(); // this caches our person object
  if (person.age >= 35) {
    return name.toUpperCase(); // then reference our cached object here
  } else {
    return name.toLowerCase();
  }
}

// Start to focus on working with Promises and Async Code
function doSomethingAsync(person) {
  return Promise.resolve(person);
}

doSomethingAsync(personObj)
  .then(data => {
    data.name = data.name.toUppercase(); // this does a thing
    console.log('uppercase', data.name); // this does a thing
    return data;
  })
  .then(modifiedData => {
    modifiedData.name = modifiedData.name.toUpperCase();
    console.log(modifiedData);
  })