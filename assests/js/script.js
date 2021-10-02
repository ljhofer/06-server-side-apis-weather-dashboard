


 //Get dates in current and future displays    
    //event listener
        //Save searched citites to local storage
        //Create button named that city 
            //Event listener that will send us back to Query while passing in the city name

// Query the API for the city -- check if it is one request or two
    //Look inside each one to see what we need to pull out
    //populate div for current wieather
        //Add classes based on current UV index 
        //Add images
    //Populate div of divs for for the five-day forecast
        //Add images


// Variables for aside
var searchBtn = $("#city-search-button");
var cityInputField = $("#cityInput")[0];

// Variables for current weather section
var mainSection = $("#main-section");
var currentCityNow = $("#current-city-now");
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


// Fetches the latitude and logiture from the API to call the second API
function getAPI(city) {
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=06875dc6f6410e88cef926ae5d7a97b9";

    fetch(requestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            cityLon = (data.coord.lon);
            cityLat = (data.coord.lat);
            getOneCall(cityLon, cityLat); 
            currentCityNow.text(data.name);
        })
}


// Fetches current and future weather from second API
function getOneCall(cityLon, cityLat){
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon="+ cityLon + "&units=imperial&appid=" + APIKey;

    fetch(requestURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        displayCurrentWeather(data);
    })

}

// Published the current weather data to page
function displayCurrentWeather(data){
    currentTemp.text("Temperature: " + data.current.temp + "°F");
    currentWind.text("Wind Speed: " + data.current.wind_speed + " MPH");
    currentHumid.text("Humidity: " + data.current.humidity + "%");
    currentUV.text("UV Index: " + data.current.uvi);
    displayFiveDayWeather(data)
}

function displayFiveDayWeather (data) {
    var dayCounter = 1;
    
    fiveDaySection.each(function() {
        $(this).children(".five-day-temp").text("Temp: " + data.daily[dayCounter].temp.max + "°F");
        $(this).children(".five-day-wind").text("Wind: " + data.daily[dayCounter].wind_speed + " MPH");
        $(this).children(".five-day-humid").text("Humidity: " + data.daily[dayCounter].humidity + "%");
        dayCounter++;
        // console.log("hello");


    })

}






// Event listener that listens for a button click, calls the function to get API, and displays main page section
searchBtn.click(function(event) {
    event.preventDefault();
    city = cityInputField.value;
    mainSection.show();
    getAPI(city);

})

