const apiKey = 'd9c7230379f68fb2f07e99e392f67957';

function getWeather() {
    const location = document.getElementById('location').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>${data.weather[0].main} - ${data.weather[0].description}</p>
    `;
}

function initMap() {
    // Create a new map centered on a default location
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7128, lng: -74.0060},
      zoom: 10
    });

    // Create a new info window for displaying the city information
    var infowindow = new google.maps.InfoWindow();

    // Add a listener to the map that gets the city name and makes a weather API request
    google.maps.event.addListener(map, 'click', function(event) {
      // Get the latitude and longitude of the clicked location
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();

      // Make a request to the reverse geocoding API to get the city name
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': {lat: lat, lng: lng}}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          // Get the city name from the results
          var city = null;
          for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results[i].types.length; j++) {
              if (results[i].types[j] === 'locality') {
                city = results[i].address_components[0].long_name;
                break;
              }
            }
            if (city) {
              break;
            }
          }

          // Make a request to the OpenWeatherMap API to get the weather information for the city
          var xhr = new XMLHttpRequest();
          var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d9c7230379f68fb2f07e99e392f67957";
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
              var response = JSON.parse(xhr.responseText);
              // Display the city name and weather information in the info window
              var contentString = "<div><h3>" + city + "</h3><p>Temperature: " + response.main.temp + " K</p><p>Weather: " + response.weather[0].main + "</p></div>";
              infowindow.setContent(contentString);
              infowindow.setPosition({lat: lat, lng: lng});
              infowindow.open(map);
            }
          }
          xhr.open("GET", url, true);
          xhr.send();
        }
      });
    });
  }
