const btn = document.getElementById('btn');
const temperature = document.getElementById('temp');
const wStatus = document.getElementById('status');
const linkIcon = document.getElementById('linkIcon');
const dayElem = document.getElementById('day');
const hourElem = document.getElementById('hour');
const rainPercent = document.getElementById('rainPercent');
const city = document.getElementById('city');
const country = document.getElementById('country');

const clouds = document.getElementById('cloudPercent');
const humidity = document.getElementById('humPercent');
const visQuality = document.getElementById('visQuality');
const visibility = document.getElementById('vis');
const airQuality = document.getElementById('airQuality');
const windSpeed = document.getElementById('windSpeed');
const windDeg = document.getElementById('windDeg');
const sunrise = document.getElementById('sunriseTime');
const sunset = document.getElementById('sunsetTime');

function convertFromUnixTime(unix) {
  const time = new Date(unix * 1000);
  return time.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: undefined,
    hour12: true
  });
}

function getWindDirection(deg) {
  switch (true) {
      case (deg >= 337.5 || deg < 22.5):
          return "North";
      case (deg >= 22.5 && deg < 67.5):
          return "Northeast";
      case (deg >= 67.5 && deg < 112.5):
          return "East";
      case (deg >= 112.5 && deg < 157.5):
          return "Southeast";
      case (deg >= 157.5 && deg < 202.5):
          return "South";
      case (deg >= 202.5 && deg < 247.5):
          return "Southwest";
      case (deg >= 247.5 && deg < 292.5):
          return "West";
      case (deg >= 292.5 && deg < 337.5):
          return "Northwest";
      default:
          return "Invalid";
  }
}

function lastUpdate() {
  wStatus.innerText = localStorage.getItem('weatherStatus');
  temperature.innerHTML = `${localStorage.getItem('weatherTemp')}<sup>°C</sup>`;
  linkIcon.setAttribute('href',`http://openweathermap.org/img/wn/${localStorage.getItem('weatherIcon')}.png`);
  rainPercent.innerText = `Rain - ${localStorage.getItem('weatherRainPercent')}mm/h`;
  city.innerText = localStorage.getItem('weatherCity');
  country.innerText = `, ${localStorage.getItem('weatherCountry')}`;
  clouds.innerText = `${localStorage.getItem('weatherClouds')}%`
  humidity.innerText = `${localStorage.getItem('weatherHumidity')}%`;
  visibility.innerText = `${localStorage.getItem('weatherVisibility')} M`;
  visQuality.innerText = `${localStorage.getItem('visQuality')}`;
  airQuality.innerText = `${localStorage.getItem('aqi')}`;
  windDeg.innerText = getWindDirection(localStorage.getItem('weatherWindDeg'));
  windSpeed.innerText = `${localStorage.getItem('weatherWindSpeed')} KM/H`;
  sunrise.innerText = convertFromUnixTime(localStorage.getItem('weatherSunrise'));
  sunset.innerText = convertFromUnixTime(localStorage.getItem('weatherSunset'));
}



btn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(2));
        const lon = parseFloat(pos.coords.longitude.toFixed(2));

        console.log(`Lat: ${lat}; Lon: ${lon}; From navigator.geolocation`);

        fetch(`/api/weather?lat=${lat}&lon=${lon}`)
          .then(response => response.json()) // Convert the response to JSON
          .then(data => {
            console.log(data); // Do something with the data

            const weatherStatus = data.weather[0].main;
            const weatherTemp = parseInt(parseFloat(data.main.temp) - 273.15);
            const weatherIcon = data.weather[0].icon;
            const weatherCity = data.name;
            const weatherCountry = data.sys.country;
            const weatherClouds = data.clouds.all;
            const weatherHumidity = data.main.humidity;
            const weatherVisibility = data.visibility;
            const weatherRainPercent = 0;
            const weatherWindSpeed = parseInt(parseFloat(data.wind.speed) * 3.6); // Transformation from m/s to km/h
            const weatherWindDeg = parseInt(data.wind.deg);
            const weatherSunrise = data.sys.sunrise;
            const weatherSunset = data.sys.sunset;

            if (data.rain) {
              weatherRainPercent = data.rain['1h'];
            }

            if (weatherVisibility < 5000) {
              visQuality.innerText = 'Poor';
            }
            else if (weatherVisibility >= 5000 && weatherVisibility < 10000) {
              visQuality.innerText = 'Moderate';
            }
            else if (weatherVisibility >= 10000) {
              visQuality.innerText = 'Excellent';
            }

            windDeg.innerText = getWindDirection(weatherWindDeg);

            localStorage.setItem('weatherStatus', weatherStatus);
            localStorage.setItem('weatherTemp', weatherTemp);
            localStorage.setItem('weatherIcon', weatherIcon);
            localStorage.setItem('weatherCity' ,weatherCity);
            localStorage.setItem('weatherCountry' ,weatherCountry);
            localStorage.setItem('weatherClouds', weatherClouds);
            localStorage.setItem('weatherHumidity', weatherHumidity);
            localStorage.setItem('weatherRainPercent', weatherRainPercent);
            localStorage.setItem('visQuality', visQuality.innerText);
            localStorage.setItem('weatherVisibility', weatherVisibility);
            localStorage.setItem('weatherWindSpeed', weatherWindSpeed);
            localStorage.setItem('weatherWindDeg', weatherWindDeg);
            localStorage.setItem('weatherSunrise', weatherSunrise);
            localStorage.setItem('weatherSunset', weatherSunset);
            
            rainPercent.innerText = `Rain - ${weatherRainPercent}mm/h`;
            wStatus.innerText = weatherStatus;
            temperature.innerHTML = `${weatherTemp}<sup>°C</sup>`;
            linkIcon.setAttribute('href',`http://openweathermap.org/img/wn/${weatherIcon}.png`);
            city.innerText = weatherCity;
            country.innerText = `, ${weatherCountry}`;
            clouds.innerText = `${weatherClouds}%`;
            humidity.innerText = `${weatherHumidity}%`;
            visibility.innerText = `${weatherVisibility} M`;
            windSpeed.innerText = `${weatherWindSpeed} KM/H`;
            sunrise.innerText = convertFromUnixTime(weatherSunrise);
            sunset.innerText = convertFromUnixTime(weatherSunset);
          })
          .catch(error => {
            console.error('Error:', error); // Handle any errors
          });

          fetch(`/api/airQuality?lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              const weatherAirQ = data.list[0].main.aqi;
              if (weatherAirQ === 1) {
                airQuality.innerText = 'Good';
              } else if (weatherAirQ === 2) {
                airQuality.innerText = 'Fair';
              } else if (weatherAirQ === 3) {
                airQuality.innerText = 'Moderate';
              } else if (weatherAirQ === 4) {
                airQuality.innerText = 'Poor';
              } else if (weatherAirQ === 5) {
                airQuality.innerText = 'Very Poor';
              }
              localStorage.setItem('aqi', airQuality.innerText);
            }).catch(error => {
              console.error('Error:', error);
            })
      },
      (error) => {
        // Handle errors from the geolocation API
        if (error.code === error.PERMISSION_DENIED) {
          alert('Geolocation permission denied. Please enable location services.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Location information is unavailable.');
        } else if (error.code === error.TIMEOUT) {
          alert('The request to get user location timed out.');
        } else if (error.code === error.UNKNOWN_ERROR) {
          alert('An unknown error occurred.');
        }
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

const now = new Date();
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const day = daysOfWeek[now.getDay()];
const hour = parseInt(now.getHours());

dayElem.innerText = day;
hourElem.innerHTML = `${hour}:00`;
