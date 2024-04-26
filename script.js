const apiKey = '';

window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getWeatherByCoordinates(latitude, longitude);
    const cityInput = document.getElementById('city-input').value;
    get_weather_info(latitude, longitude,cityInput);
  }, error => {
    console.error(error);
  });
});

function getWeatherByCoordinates(latitude, longitude) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=fr&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
    });
}
function get_weather_info(latitude=null, longitude=null,city=null) {
  if(city==null){
    const uri="https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=fr&units=metric"
  }else{
    const uri="https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=fr&units=metric"
  }
  fetch(`${uri}`)
      .then(response => response.json())
      .then(data => {
          const temperature = data.main.temp;
          const humidity = data.main.humidity;
          const cityName = data.name;
          let card_div = document.getElementById('w-info');
          card_div.innerHTML = `
          <div class=" align-items-center ml-4">
            <div class="d-flex">
              <img src="images/map.png" height=60px width=60px class="mb-4" alt="Cloudy">
              <h2 class="m3">${cityName}</h1>
            </div>
            <div class="d-flex">  
              <img src="images/cloudy.png" height=60px width=60px class="mb-4 mt-2" alt="Cloudy">
              <h2 class="m-3">Temperature: ${temperature}</h2>
            </div>
            <div class="d-flex">  
              <img src="/images/houmy.png" height=60px width=60px class="mb-4 mt-2" >
              <h2 class="m3">Humidity: ${humidity}</h2>
            </div>
            </div>
           `;
      })
      .catch(error => {
          console.error('Error fetching weather data:', error);
      });
}

function searchWeather() {
  const cityInput = document.getElementById('city-input').value;
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&lang=fr&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error('Error fetching forecast for city:', error);
    });
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
  
  // Check if a chart instance already exists and destroy it
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  // Create a new chart instance
  window.chartInstance = new Chart(ctx, {
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
}


