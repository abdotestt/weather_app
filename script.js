const apiKey = '3386785b3ab623f90e80f3843a3df13b';

window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getWeatherInfo(latitude, longitude);
  }, error => {
    console.error(error);
  });
});

function getWeatherInfo(latitude, longitude, city = "") {
  const uri = city ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=fr&units=metric` : `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=fr&units=metric`;

  fetch(uri)
    .then(response => response.json())
    .then(data => {
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function searchWeather() {
  const cityInput = document.getElementById('city-input').value;
  if(cityInput) {
    getWeatherInfo(null, null, cityInput);
  }
}

function displayWeatherData(data) {
  const temperature = data.list[0].main.temp;
  const humidity = data.list[0].main.humidity;
  const cityName = data.city.name;
  const weatherIconCode = data.list[0].weather[0].icon; // Get weather icon code

  // URL base des icônes météo
  const iconBaseUrl = 'https://openweathermap.org/img/wn/';
  const weatherIconUrl = iconBaseUrl + weatherIconCode + '.png'; // Construire l'URL de l'icône météo

  let cardDiv = document.getElementById('w-info');
  cardDiv.innerHTML = `
    <div class=" align-items-center ml-4">
      <div class="d-flex">
        <img src="images/map.png" height=60px width=60px class="mb-4" alt="Weather Icon">
        <h2 class="m3">${cityName}</h1>
      </div>
      <div class="d-flex">  
        <img src="images/cloudy.png" height=60px width=60px class="mb-4 mt-2" alt="Cloudy">
        <h2 class="m-3">Temperature: ${temperature}</h2>
      </div>
      <div class="d-flex">  
        <img src="images/houmy.png" height=60px width=60px class="mb-4 mt-2" >
        <h2 class="m3">Humidity: ${humidity}</h2>
      </div>
    </div>
  `;

  displayForecast(data);
}

function displayForecast(data) {
  const forecastData = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('fr-FR');
    if (!acc[date]) {
      acc[date] = {
        date: date,
        temperature: item.main.temp
      };
    }
    return acc;
  }, {});

  const labels = Object.keys(forecastData);
  const temperatures = labels.map(date => forecastData[date].temperature);

  const ctx = document.getElementById('forecast-chart').getContext('2d');
  
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Température (°C)',
        data: temperatures,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  window.chartInstance = chart;
}
