

// Create a header with title

// Create a side bar with input box, search button
    //event listener
        //Save searched citites to local storage
        //Create button named that city 
            //Event listener that will send us back to Query while passing in the city name

// Query the API for the city -- check if it is one request or two
    //Look inside each one to see what we need to pull out
    //Add a dive for the current weather and populate it
        //Add classes based on current UV index 
        //Add images
    //Add div of divs for the five-day forecast, populate it
        //Add images

var searchBtn = $("city-search-button");
var cityInputField = $("cityInput");

var city = "";


function getAPI(city) {
    var APIKey = "06875dc6f6410e88cef926ae5d7a97b9";
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=06875dc6f6410e88cef926ae5d7a97b9";

    fetch(requestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })

}

getAPI();

searchBtn.click(function() {
    console.log(city);
    city = cityInputField;
    getAPI(city);

})

