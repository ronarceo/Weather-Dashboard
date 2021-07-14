//variables to store API key
var APIKey = "3b27d7b38f6bc4d03767615ede7e0436";
//array to store cities that user searches for in local storage
var citySearch = [];

//function that gets necessary data from OpenWeather One Call API
function getWeather(city) {
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

//user inputs city to display weather and 5 day forecast and adds it to local storage
$("#searchButton").on('click', function(event){
  event.preventDefault();

  var city = $('.userInput').val();
  
  getWeather(city);

  if (localStorage.getItem('myCities') !== null) {
      let existing = JSON.parse(localStorage.getItem('myCities'));
      existing.push(city);
      localStorage.setItem('myCities', JSON.stringify(existing));
      
  } 
   else if (localStorage.getItem('myCities') === null){
      citySearch.push(city);
      localStorage.setItem('myCities', JSON.stringify(citySearch));
  }
}) 

// cities stored in local storage are added to the user's search history
function getCities() {
  if (localStorage.getItem('myCities') !== null) {
      let mySearch = JSON.parse(localStorage.getItem('myCities'));
      
      for (let i = 0; i < mySearch.length; i++) {
          let displayDiv = $('<button>');
          displayDiv.addClass("cityButton, btn-secondary");
          displayDiv.text(mySearch[i]);
          displayDiv.attr('value', mySearch[i]);
          $("#pastCities").append(displayDiv);         
      }     
  }
}
getCities();

// clears the search history from local storage
$('#clearButton').on('click', function(){
  localStorage.clear();
  location.reload();
})

// displays weather and 5 day forecast for cities in user's search history
$('.cityButton').on('click', function(){
  city = $(this).val();
  getWeather(city);    
})