'use strict';

$(function() {
  $('.lookupForm').submit(getCompany);
  $('table').on('click', '.quote', getCard);
  // momentTimer();
});

// function momentTimer() {
//   $('.hero-face').text(moment().format());
// }

function getCard(e) {

  var company = MarketDataStorage.get();
  var exchange = $(this).parent().parent().children()[0].textContent;
  var name = $(this).parent().parent().children()[1].textContent;
  var symbol = $(this).parent().parent().children()[2].textContent;

  $(this).parent().parent().remove();

  var obj = {};
  obj.exchange = exchange;
  obj.name = name;
  obj.symbol = symbol;
  company.push(obj);

  getQuotes(symbol);

  MarketDataStorage.write(company);

  e.stopPropagation();
  $(this).remove();
}

function getQuotes(symbol) {

  var url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${symbol}&callback=?`;
  $.getJSON({
    url: url,
    success: function(companyTrackData) {
      
      var $track = makeCompanyTrack(companyTrackData);
      $('#companyTrack').append($track);
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
      var $companyCards = companyData.map(makeCompanyList);
      $('table').show().append($companyCards);
    },
    error: function(err) {
      console.error(err);
    }
  });
}

function makeCompanyList(companyObj) {
  var $card = $('<tr>').addClass('contactList');
  var $exchange = $('<td>').text(`${companyObj.Exchange}`);
  var $name = $('<td>').text(`${companyObj.Name}`);
  var $symbol = $('<td>').text(`${companyObj.Symbol}`);
  var $button = $('<td>').append('<button class="quote">Quote</button>');

  $card.append($exchange, $name, $symbol, $button);
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
