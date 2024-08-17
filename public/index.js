const btn = document.getElementById('btn');
const temperature = document.getElementById('temp');
const wStatus = document.getElementById('status');
const linkIcon = document.getElementById('linkIcon');
const weatherIconImg = document.getElementById('weatherIcon');

function lastUpdate() {
  wStatus.innerText = localStorage.getItem('weatherStatus');
  temperature.innerText = localStorage.getItem('weatherTemp');
  linkIcon.setAttribute('href',`http://openweathermap.org/img/wn/${localStorage.getItem('weatherIcon')}.png`);
  weatherIconImg.setAttribute('src',`http://openweathermap.org/img/wn/${localStorage.getItem('weatherIcon')}.png`);
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

            localStorage.setItem('weatherStatus', weatherStatus);
            localStorage.setItem('weatherTemp', weatherTemp);
            localStorage.setItem('weatherIcon', weatherIcon);
            
            wStatus.innerText = weatherStatus;
            temperature.innerText = weatherTemp;
            linkIcon.setAttribute('href',`http://openweathermap.org/img/wn/${weatherIcon}.png`);
            weatherIconImg.setAttribute('src',`http://openweathermap.org/img/wn/${weatherIcon}.png`);
          })
          .catch(error => {
            console.error('Error:', error); // Handle any errors
          });
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
