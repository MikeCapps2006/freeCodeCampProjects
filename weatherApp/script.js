/* jslint devel: true */

//Instantiate skycon icon

var skycons = new Skycons({"color": "blue"});

skycons.add("animated-icon", Skycons.RAIN);

skycons.play();

//Global variables

var latitude, longitude, localTime;

//Function to update time by latitude and longitude
function updateTimeByLatLong(latitude, longitude){
    $.getJSON('http://api.geonames.org/timezoneJSON?lat=' + latitude + '&lng=' + longitude + '&username=mikecapps', function (timezone) {
		var rawTimeZone = JSON.stringify(timezone);
		var parsedTimeZone = JSON.parse(rawTimeZone);
		var dateTime = parsedTimeZone.time;
		localTime = dateTime.substr(11);
		$('.time').html(localTime);
		});
}

//Function to update time by Zip Code
function updateTimeByZipCode(code){
    $.getJSON('http://api.geonames.org/postalCodeLookupJSON?postalcode='+ code + '&country=US&username=mikecapps', function (postalCode) {
		latitude = postalCode.postalcodes[0].lat;
        longitude = postalCode.postalcodes[0].lng;
        updateTimeByLatLong(latitude, longitude);
		});
}


//Function to update weather

function updateWeather(json) {	
		
	//Update weather and temperature
	var weather = json.weather[0].description;
	$('.weatherConditions').html(weather);
	
	var temp = [(json.main.temp - 273.15).toFixed(0) + "°C", (1.8 * (json.main.temp - 273.15) + 32).toFixed(0) + "°F"];
	$('.temp-celcius').html(temp[0]);
	$('.temp-fahrenheit').html(temp[1]);
	$('.temp').on('click', function() {
		$('.temp-celcius').toggle();
		$('.temp-fahrenheit').toggle();
		});
	
	var city = json.name;
	$('.location').html(" for " + city);
	
	//Update weather skycon based on weatherConditions
	if(weather.indexOf("rain") >= 0) {
		skycons.set("animated-icon", Skycons.RAIN);
	}

	else if (weather.indexOf("sunny") >= 0) {
		skycons.set("animated-icon", Skycons.CLEAR_DAY);
	}

	else if (weather.indexOf("clear") >= 0) {
			skycons.set("animated-icon", Skycons.CLEAR_DAY);
	}

	else if (weather.indexOf("cloud") >= 0) {
			skycons.set("animated-icon", Skycons.PARTLY_CLOUDY_DAY);

		
	}

	else if (weather.indexOf("thunderstorm") >= 0) {
		skycons.set("animated-icon", Skycons.SLEET);
	}

	else if (weather.indexOf("snow") >= 0) {
		skycons.set("animated-icon", Skycons.SNOW);
	}
}

//Check for position
$(document).ready(function(){
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentLocation);
    } else {
        alert("Geolocation is not supported by your browser, download the latest Chrome or Firefox to use this app");
    }
    
    $('.btn-search').click(function (e) {
        e.preventDefault();
        var code = $('#zipCode').val();
        getLocationZip(code);
        updateTimeByZipCode(code);
    })
})

function getCurrentLocation(pos){
			latitude = pos.coords.latitude;
			longitude = pos.coords.longitude;
            var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=eab0a76443c15583b8f30cd0b0df29d8";
			$.getJSON(weatherAPI, function (data) {
				var rawJson = JSON.stringify(data);
				var json = JSON.parse(rawJson);
				updateWeather(json);
                updateTimeByLatLong(latitude, longitude);
				}
            );
        }
function getLocationZip(code){
    var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?zip=' + code + ',us&appid=eab0a76443c15583b8f30cd0b0df29d8';
    $.getJSON(weatherAPI, function(data){
        var rawJson = JSON.stringify(data);
        var json = JSON.parse(rawJson);
        updateWeather(json);
    })
}









