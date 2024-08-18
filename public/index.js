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
            
            rainPercent.innerText = `Rain - ${weatherRainPercent}mm/h`;
            wStatus.innerText = weatherStatus;
            temperature.innerHTML = `${weatherTemp}<sup>°C</sup>`;
            linkIcon.setAttribute('href',`http://openweathermap.org/img/wn/${weatherIcon}.png`);
            city.innerText = weatherCity;
            country.innerText = `, ${weatherCountry}`;
            clouds.innerText = `${weatherClouds}%`;
            humidity.innerText = `${weatherHumidity}%`;
            visibility.innerText = `${weatherVisibility} M`;
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
