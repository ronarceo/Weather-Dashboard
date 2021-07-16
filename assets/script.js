//variables to store API key
var APIKey = "3b27d7b38f6bc4d03767615ede7e0436";
//variable for current date
let date = moment().format('L'); 
//array to store cities that user searches for in local storage
var citySearch = [];

//function that gets necessary data from OpenWeather One Call API
function getWeather(city) {
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let icon = $('<img class="icon">');
      icon.attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png")

      $("#cityDisplay").text(data.name + " " + "(" + date + ")").append(icon);
      $("#temperatureDisplay").text("Temp: " + data.main.temp + " \u00B0F");
      $("#windSpeedDisplay").text("Wind: " + data.wind.speed + " MPH");
      $("#humidityDisplay").text("Humidity: " + data.main.humidity + "%");

      var uvIndexURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + APIKey + "&units=imperial";
      fetch(uvIndexURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data){
        console.log(data);
        let uvIndex = data.current.uvi;

        if(uvIndex < 2.9){
          $('#uvIndexDisplay').text("UV Index: ").append("<span class='favorable'>" + uvIndex + '</span');
      } else if (uvIndex > 3.0 && uvIndex < 7.9) {
          $('#uvIndexDisplay').text("UV Index: ").append("<span class='moderate'>" + uvIndex + '</span');
      } else if (uvIindex > 8.0){
          $('#uvIndexDisplay').text("UV Index: ").append("<span class='severe'>" + uvIndex + '</span');
      }
      $("#forecastHeader").text("5-Day Forecast:");

      let days = ['day1', 'day2', 'day3', 'day4', 'day5']
      for (let i = 1; i < days.length +1 ; i++) {
                
        let cardDiv = $('<div class="card col">');
        let dayHeader = $('<p class="next-day">');
        let dayIcon = $('<img class="icon">');
        let dayTemp = $('<p class="temp">');
        let dayHumidity = $('<p class="humid">');

        let timestamp = data.daily[i].dt * 1000;
        
        const d = new Date(timestamp);
        date = d.toDateString();
        
        dayHeader.text(date)
        dayIcon.attr("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon +".png");
        dayTemp.text("Temp: " + data.daily[i].temp.day + " \u00B0F");
        dayHumidity.text("Humidity: " + data.daily[i].humidity + "%");

        $('.forecastDisplay').append(cardDiv);
        cardDiv.append(dayHeader, dayIcon, dayTemp, dayHumidity);
      }
      })
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
          displayDiv.addClass("cityButton btn-secondary");
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
  console.log(city);
  getWeather(city);
})