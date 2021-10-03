
// Variables for aside
var searchBtn = $("#city-search-button");
var cityInputField = $("#cityInput")[0];
var previousSearches = $("#previous-searches");

// Variables for current weather section and Moment JS functionality
var now = moment();
var mainSection = $("#main-section");
var currentCityNow = $("#current-city-now");
var currentDate = $("#current-date");
var currentWeatherIcon = $("#current-weather-icon");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHumid = $("#current-humid");
var currentUV = $("#current-UV");

// Variable for five day forecast area
var fiveDaySection = $(".five-day-section");

// Universal variables
var city = "";
var cityLat = "";
var cityLon = "";
var APIKey = "06875dc6f6410e88cef926ae5d7a97b9";
var previousCities = [];
var currentUVIndex = "";


// Sets the current date and displays local storage elements on page load and poluates if necessary
function start() {
    currentDate.text(now.format("dddd, MMMM Do"));

    if (localStorage.getItem("previousCities") !== null) {
        previousCities = JSON.parse(localStorage.getItem("previousCities"));
        
        for (i = 0; i < previousCities.length; i++) {
            var newButton = $("<button>");
            var previousCityName = previousCities[i];
            
            newButton.text(previousCityName);
            newButton.addClass("previousCityButton")
            newButton.appendTo(previousSearches);
        }   
}
}

// Checks to see if current city is already in local storage and creates a button if not
function checkLocalStorage(city) {
   if (!previousCities.includes(city)) {
        // Adds city to local storage array
        previousCities.push(city);
        localStorage.setItem("previousCities", JSON.stringify(previousCities));

        // Creates a button in previously searched cities area
        var newButton = $("<button>");
        newButton.text(city);
        newButton.addClass("previousCityButton")
        newButton.appendTo(previousSearches);
   }
}

// Fetches the latitude and logitude from the API to use in call the second API
function getAPI(city) {
    mainSection.show();
    city = city.toUpperCase();
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=06875dc6f6410e88cef926ae5d7a97b9";

    // Request for data from API
    fetch(requestURL)
        .then(function(response){
            if (response.ok) {
                response.json().then(function(data) {
                    cityLon = (data.coord.lon);
                    cityLat = (data.coord.lat);
                    
                    // Calls functions for checking local storage and the next API call for weather data
                    checkLocalStorage(city);
                    getOneCall(cityLon, cityLat); 
                    currentCityNow.text(city);
        
                    var iconCode = data.weather[0].icon;
                    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    currentWeatherIcon.attr("src", iconURL);
                })
             // Alerts user if there is an error or if their input is invalid    
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function(error){
            alert("Unable to connect to Weather Dashboard");
        })
}

// Fetches current and future weather from second API
function getOneCall(cityLon, cityLat) {
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon="+ cityLon + "&units=imperial&appid=" + APIKey;

    fetch(requestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            displayCurrentWeather(data);
        })
}

// Publishes the current weather data to page
function displayCurrentWeather(data) {
    // Changes text content in current weather area
    currentTemp.text("Temperature: " + data.current.temp + "°F");
    currentWind.text("Wind Speed: " + data.current.wind_speed + " MPH");
    currentHumid.text("Humidity: " + data.current.humidity + "%");
    currentUV.text("UV Index " + data.current.uvi);
    currentUVIndex = (data.current.uvi);
    
    // Calls the functions to set five day forecast and display UV index condtitions
    displayFiveDayWeather(data);
    displayUVConditions(currentUVIndex);
}

// Checks value of UV index and changes its color appropriately
function displayUVConditions(currentUVIndex) {
    currentUV.removeClass("severe");
    currentUV.removeClass("moderate");
    currentUV.removeClass("favorable");
    if (currentUVIndex >= 6) {
        currentUV.addClass("severe");
    } else if(currentUVIndex >= 3 && currentUVIndex < 6) {
        currentUV.addClass("moderate");
    } else {
        currentUV.addClass("favorable");
    }
}

// Publises the five day weather data to page
function displayFiveDayWeather (data) {
    var dayCounter = 1;
    
    fiveDaySection.each(function() {
        var iconCode = data.daily[dayCounter].weather[0].icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        var nowI = now.add(1, "day");
        
        // Iterates over the HTML elements to set the to reflect the API data
        $(this).children(".five-day-heading").text(nowI.format("ddd MM/DD"));
        $(this).children(".five-day-icons").attr("src", iconURL);
        $(this).children(".five-day-temp").text("Temp: " + data.daily[dayCounter].temp.max + "°F");
        $(this).children(".five-day-wind").text("Wind: " + data.daily[dayCounter].wind_speed + " MPH");
        $(this).children(".five-day-humid").text("Humidity: " + data.daily[dayCounter].humidity + "%");
        
        //Increased day counter by one
        dayCounter++;
    })
}


// Calls start function
start();

// Event listener that listens for a button click, calls the function to get API, and clears input field 
searchBtn.click(function(event) {
    event.preventDefault();
    city = cityInputField.value;
    cityInputField.value = "";
    getAPI(city);  
})

// Event listener for clicks on buttons for previously searched cities
previousSearches.click(function(event){
    getAPI(event.target.textContent);  
})