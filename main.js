'use strict';

$(function() {
  $('.personForm').submit(getPerson);
  renderPeople();
});

function renderPeople(page) {
  $.ajax(`http://swapi.co/api/people/?page=${page}`)
    .done(function(data) {
      var personObjs = data.results;
      var $personCards = personObjs.map(makePersonCard);
      $('.people').append($personCards);
    })
    .fail(function(err) {
      console.error(err);
    });

}

function makePersonCard(personObj) {
  var $card = $('<div>').addClass('card');
  var $name = $('<p>').text(`Name: ${personObj.name}`);
  var $birth = $('<p>').text(`Birth: ${personObj.birth_year}`);
  var $gender = $('<p>').text(`Gender: ${personObj.gender}`);

  $card.append($name, $birth, $gender);
  return $card;
}

function getPerson(event) {
  event.preventDefault();
  var personNum = $('.personNumber').val();

  $.ajax({
    url: `http://swapi.co/api/people/${personNum}/`,
    success: function(personData) {
      var $person = makePersonCard(personData);
      $('.people').append($person);
    },
    error: function(err) {
      console.error(err);
    }
  });
}