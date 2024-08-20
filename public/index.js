const temperature = document.getElementById('temp');
const wStatus = document.getElementById('status');
const linkIcon = document.getElementById('linkIcon');
const dayElem = document.getElementById('day');
const hourElem = document.getElementById('hour');
const rainPercent = document.getElementById('rainPercent');
const city = document.getElementById('city');
const country = document.getElementById('country');
const icon = document.getElementById('weatherIcon')

const fiveDays = document.querySelectorAll('.days');
const dayTitles = document.querySelectorAll('.dayTitle');
const dayIcon = document.querySelectorAll('.dayIcon');
const dayMaxTemp = document.querySelectorAll('.maxTemp');
const dayMinTemp = document.querySelectorAll('.minTemp');

const clouds = document.getElementById('cloudPercent');
const humidity = document.getElementById('humPercent');
const visQuality = document.getElementById('visQuality');
const visibility = document.getElementById('vis');
const airQuality = document.getElementById('airQuality');
const windSpeed = document.getElementById('windSpeed');
const windDeg = document.getElementById('windDeg');
const sunrise = document.getElementById('sunriseTime');
const sunset = document.getElementById('sunsetTime');

const now = new Date();
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const day = daysOfWeek[now.getDay()];
const hours = parseInt(now.getHours());
const minutes = parseInt(now.getMinutes());

dayElem.innerText = day;
hourElem.innerHTML = `${hours}:${minutes}`;


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

function Update() {
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
            const weatherIcon = weatherStatus;
            const weatherCity = data.name;
            const weatherCountry = data.sys.country;
            const weatherClouds = data.clouds.all;
            const weatherHumidity = data.main.humidity;
            const weatherVisibility = data.visibility / 1000;
            const weatherRainPercent = 0;
            const weatherWindSpeed = parseFloat((parseFloat(data.wind.speed) * 3.6).toFixed(2)); // Transformation from m/s to km/h
            const weatherWindDeg = parseFloat(data.wind.deg);
            const weatherSunrise = data.sys.sunrise;
            const weatherSunset = data.sys.sunset;

            if (data.rain) {
              weatherRainPercent = data.rain['1h'];
            }

            if (weatherVisibility < 5) {
              visQuality.innerText = 'Poor';
            }
            else if (weatherVisibility >= 5 && weatherVisibility < 10) {
              visQuality.innerText = 'Moderate';
            }
            else if (weatherVisibility >= 10) {
              visQuality.innerText = 'Excellent';
            }

            windDeg.innerText = getWindDirection(weatherWindDeg);
            
            rainPercent.innerText = `Rain - ${weatherRainPercent}mm/h`;
            wStatus.innerText = weatherStatus;
            temperature.innerHTML = `${weatherTemp}<sup>°C</sup>`;
            linkIcon.setAttribute('href',`/img/${weatherIcon}.png`);
            icon.src = `/img/${weatherIcon}.png`;
            city.innerText = weatherCity;
            country.innerText = `, ${weatherCountry}`;
            clouds.innerText = `${weatherClouds}%`;
            humidity.innerText = `${weatherHumidity}%`;
            visibility.innerText = `${weatherVisibility} KM`;
            windSpeed.innerText = `${weatherWindSpeed} KM/H`;
            sunrise.innerText = convertFromUnixTime(weatherSunrise);
            sunset.innerText = convertFromUnixTime(weatherSunset);
          })
          .catch(error => {
            console.error('Error:', error); // Handle any errors
          });

          fetch(`/api/5day-forecast?lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              let forecasts = data.list;
              const dailyData = {};

              forecasts.forEach(forecast => {
                const date = forecast.dt_txt.split(' ')[0];
                const forecastTemp = forecast.main.temp;
                const forecastWeather = forecast.weather[0].main;

                if (!dailyData[date]) {
                  dailyData[date] = {
                    min_temp: forecastTemp,
                    max_temp: forecastTemp,
                    weather_status: {},
                  };
                }

                dailyData[date].min_temp = Math.min(dailyData[date].min_temp, forecastTemp);
                dailyData[date].max_temp = Math.max(dailyData[date].max_temp, forecastTemp);

                if (!dailyData[date].weather_status[forecastWeather]) {
                  dailyData[date].weather_status[forecastWeather] = 0;
                }
                dailyData[date].weather_status[forecastWeather]++;
              });

              const result = Object.keys(dailyData).map(date => {
                const dayStatus = dailyData[date].weather_status;
                const mostCommonWeather = Object.keys(dayStatus).reduce((a, b) => dayStatus[a] > dayStatus[b] ? a : b);

                return {
                  date,
                  min_temp: dailyData[date].min_temp,
                  max_temp: dailyData[date].max_temp,
                  weather_status: mostCommonWeather,
                };
              });

              console.log(result);

              let i = 1;
              dayTitles.forEach(dayTitle => {
                const dayCalendar = new Date(result[i].date);
                dayTitle.innerText = `${daysOfWeek[dayCalendar.getDay()]}`;
                i += 1;
              });

              i = 1;

              dayIcon.forEach(img => {
                img.src = `/img/${result[i].weather_status}.png`;
                i += 1;
              });

              i = 1;

              dayMaxTemp.forEach(dayTemp => {
                dayTemp.innerText = `${parseInt(result[i].max_temp)}°`;
                i += 1;
              });

              i = 1;

              dayMinTemp.forEach(dayTemp => {
                dayTemp.innerText = `${parseInt(result[i].min_temp)}°`;
                i += 1;
              });

            }).catch(error => {
              console.error('Error:', error);
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
};