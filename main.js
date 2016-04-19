'use strict';

$(function() {
  // $('.personForm').submit(getPerson);
  // renderPeople();
  $('.lookupForm').submit(getCompany);
  $('#company').on('click', '.card', getCard);
});

// http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=computer&callback=myFunction
// $.getJSON('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=NFLX&callback=?')`

// http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=CPSI&callback=?
// http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=CPSI&callback=myFunction

function getCard(e) {

  // MarketDataStorage.write

  var company = MarketDataStorage.get();
  // console.log($(this).children());

  var arr = $(this).children();
   
  var exchange = $(arr[0]).text(); 
  var name = $(arr[1]).text(); 
  var symbol = $(arr[2]).text(); 

  var obj = {};
  obj.exchange = exchange;
  obj.name = name;
  obj.symbol = symbol;
  company.push(obj);

  var arrSymbol = symbol.split(': ');
  getQuotes(arrSymbol[1]);

  MarketDataStorage.write(company);

  e.stopPropagation();
  $(this).remove();
}

function getQuotes(symbol) {

 // var url = `http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${inputCat}&callback=?`;
  var url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${symbol}&callback=?`;
  $.getJSON({
    url: url,
    success: function(companyTrackData) {
      // var $company = makeCompanyList(companyData);
      // $('.company').append($company);

      // console.log('companyTrackData: ', companyTrackData.Name);
      // console.log('companyTrackData: ', companyTrackData.Symbol);
      // console.log('companyTrackData: ', companyTrackData.High);
      // console.log('companyTrackData: ', companyTrackData.Low);

      var $track = makeCompanyTrack(companyTrackData);
      $('.company').append($track);

      // var $companyCards = companyData.map(makeCompanyList);
      // $('.company').append($companyCards);
    },
    error: function(err) {
      console.error(err);
    }
  });
}

function makeCompanyTrack(companyTrackData) {

  var $card = $('<div>').addClass('card');
  var $name = $('<p>').text(`Name: ${companyTrackData.Name}`);
  var $symbol = $('<p>').text(`Symbol: ${companyTrackData.Symbol}`);
  var $high = $('<p>').text(`High: ${companyTrackData.High}`);
  var $low = $('<p>').text(`Low: ${companyTrackData.Low}`);

  $card.append($name, $symbol, $high, $low);
  return $card;

}


function getCompany() {
  event.preventDefault();
  var inputCat = $('.inputCategory').val();

  var url = `http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${inputCat}&callback=?`;
  $.getJSON({
    url: url,
    success: function(companyData) {
      // var $company = makeCompanyList(companyData);
      // $('.company').append($company);

      var $companyCards = companyData.map(makeCompanyList);
      $('.company').append($companyCards);
    },
    error: function(err) {
      console.error(err);
    }
  });
}

function makeCompanyList(companyObj) {
  var $card = $('<div>').addClass('card');
  var $exchange = $('<p>').text(`Exchange: ${companyObj.Exchange}`);
  var $name = $('<p>').text(`Name: ${companyObj.Name}`);
  var $symbol = $('<p>').text(`Symbol: ${companyObj.Symbol}`);

  $card.append($exchange, $name, $symbol);
  return $card;
}

var MarketDataStorage = {
  get: function() {
    try {
      var companyList = JSON.parse(localStorage.Stocks);
    } catch(err) {
      var companyList = [];
    }
    return companyList;
  },
  write: function(companyList) {
    localStorage.Stocks = JSON.stringify(companyList);
  }
};

// function makeCompanyList(companyData) {
//   var array = [];
//   for (var i=0; i<companyData.length; i++) {
//     var $card = $('#singleCompany').clone().removeAttr('id');
//     $card.find('.exchange').text('Exchange: ' + companyData[i].Exchange);
//     $card.find('.name').text('Name: ' + companyData[i].Name);
//     $card.find('.symbol').text('Symbol: ' + companyData[i].Symbol);
   
//      array.push($card);
//   }

//   $('#company').append(array);

// }



// function renderCompany(page) {
//   $.ajax(`http://swapi.co/api/people/?page=${page}`)
//     .done(function(data) {
//       var personObjs = data.results;
//       var $personCards = personObjs.map(makePersonCard);
//       $('.people').append($personCards);
//     })
//     .fail(function(err) {
//       console.error(err);
//     });
// }



// // $.getJSON('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=NFLX&callback=?')`
// function renderPeople(page) {
//   $.ajax(`http://swapi.co/api/people/?page=${page}`)
//     .done(function(data) {
//       var personObjs = data.results;
//       var $personCards = personObjs.map(makePersonCard);
//       $('.people').append($personCards);
//     })
//     .fail(function(err) {
//       console.error(err);
//     });
// }

// function makePersonCard(personObj) {
//   var $card = $('<div>').addClass('card');
//   var $name = $('<p>').text(`Name: ${personObj.name}`);
//   var $birth = $('<p>').text(`Birth: ${personObj.birth_year}`);
//   var $gender = $('<p>').text(`Gender: ${personObj.gender}`);

//   $card.append($name, $birth, $gender);
//   return $card;
// }

// function getPerson(event) {
//   event.preventDefault();
//   var personNum = $('.personNumber').val();

//   $.ajax({
//     url: `http://swapi.co/api/people/${personNum}/`,
//     success: function(personData) {
//       var $person = makePersonCard(personData);
//       $('.people').append($person);
//     },
//     error: function(err) {
//       console.error(err);
//     }
//   });
// }