// DOM Elements
const key = '5f666d0a454737f9bd70ace0543b52b9';
const searchInput = document.getElementById('addressSearch');
const searchButton = document.querySelector('.search-button');
const locationPrompt = document.getElementById('location-prompt');
const allowLocationButton = document.getElementById('allow-location-button');
const weatherContainer = document.querySelector('.weather-container');

// Modal elements
const modal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseButton = document.getElementById('modal-close-button');


// Modal functions 
export function showModal(message) {
    modalMessage.textContent = message;
    modal.showModal(); // VIDEO COMMENT: Modal Dialogos display
}

export function closeModal() {
    modal.close();
}


// Load Weather Functions
    // Live Weather
    async function loadWeatherNow(lat, lon) {
        const urlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

        try {
            const response = await fetch(urlNow); // VIDEO COMMENT: Fetching data from the OpenWeather API
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json(); // VIDEO COMMENT: Parsing the data to JSON

            // City
                const city = document.getElementById('city');
                city.innerText = data.name;

                localStorage.setItem('weatherLocation', JSON.stringify({lat: lat, lon: lon, name: data.name})) // VIDEO COMMENT: Saving the location in the Local storage

            // Icon
                const image = document.getElementById('weatherImg');
                image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            // Description
                const description = document.getElementById('description');
                description.innerText = data.weather[0].description;
            
            // Temperature
                const temperature = document.getElementById('temperature');
                temperature.innerText = `${Math.round(data.main.temp)}°C`;

            // Rain
                const rain = document.getElementById('rain');
                if (data.rain && data.rain['1h']) {
                    rain.innerText = `${data.rain['1h']} mm`;
                } else {
                    // If no rain data, display 0
                    rain.innerText = '0 mm';
                }

            // Feels Like
                const feelsLike = document.getElementById('feelsLike');
                feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`

            // Humidity
                const humidity = document.getElementById('humidity');
                humidity.innerText = `${data.main.humidity}%`;

            // Clouds
                const clouds = document.getElementById('clouds');
                clouds.innerText = `${data.clouds.all}%`;

            // City name for Forecast part
                const forecastCity = document.getElementById('forecastTitle');
                forecastCity.innerText = `3-day Forecast for ${data.name}`;


        } catch (error) {
            showModal("Could not load current weather data. Please try again.");
        }  
    }

    // Weather Forecast
    async function loadWeatherForecast(lat, lon) {
        const forecastList = document.getElementById('forecastCards')
        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

        try {
            const response = await fetch(urlForecast);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            const forecasts = data.list.filter(item => { // VIDEO COMMENT: Filtering the array by the time
                const forecastDate = new Date(item.dt * 1000);
                return forecastDate.getHours() === 12;
            }).slice(0, 3);

            forecastList.innerHTML = '';

            forecasts.forEach(forecast => { // VIDEO COMMENT: Creating content dinamically
                // Forecast Card
                    const forecastCard = document.createElement('div');
                    forecastCard.classList.add('weather-card');

                // Date
                    const date = document.createElement('p');
                    date.classList.add('card-title');
                    const forecastDate = new Date(forecast.dt * 1000);
                    const day = forecastDate.getDate().toString().padStart(2, '0');
                    const month = forecastDate.toLocaleString('en-US', { month: 'short' });
                    date.innerText = `${month}/${day}`;
                    forecastCard.appendChild(date);

                // Temperature
                    const tempItem = document.createElement('div');
                    tempItem.classList.add('weather-info-item', 'tempContainer');
                    const tempValue = document.createElement('p');
                    tempValue.classList.add('info-text', 'temperature');
                    tempValue.innerText = `${Math.round(forecast.main.temp)}°C`
                    tempItem.appendChild(tempValue);
                    forecastCard.appendChild(tempItem);

                // Icon
                    const figure = document.createElement('figure');
                    figure.classList.add('w-image-container');

                    const icon = document.createElement('img');
                    icon.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
                    icon.alt = forecast.weather[0].description;
                    icon.classList.add('weather-img');
                
                // Description
                    const description = document.createElement('p');
                    description.classList.add('weather-desc');
                    description.innerText = forecast.weather[0].description;

                    figure.appendChild(icon);
                    figure.appendChild(description);
                    forecastCard.appendChild(figure);
                
                // Wetaher Info Card
                    const weatherInfo = document.createElement('div');
                    weatherInfo.classList.add('weather-info')

                // Rain
                    const rainItem = document.createElement('div');
                    rainItem.classList.add('weather-info-item');
                    rainItem.innerHTML = `
                        <p class="info-title">Rain:</p>
                        <p class="info-text">${(forecast.rain && forecast.rain['3h']) ? forecast.rain['3h'] + ' mm' : '0 mm'}</p>
                    `;
                    weatherInfo.appendChild(rainItem);

                // Feels Like
                    const feelsLikeItem = document.createElement('div');
                    feelsLikeItem.classList.add('weather-info-item');
                    feelsLikeItem.innerHTML = `
                        <p class="info-title">Feels Like:</p>
                        <p class="info-text">${Math.round(forecast.main.feels_like)}°C</p>
                    `;
                    weatherInfo.appendChild(feelsLikeItem);

                // Humidity
                    const humidityItem = document.createElement('div');
                    humidityItem.classList.add('weather-info-item');
                    humidityItem.innerHTML = `
                        <p class="info-title">Humidity:</p>
                        <p class="info-text">${forecast.main.humidity}%</p>
                    `;
                    weatherInfo.appendChild(humidityItem);

                // Clouds
                const cloudsItem = document.createElement('div');
                    cloudsItem.classList.add('weather-info-item');
                    cloudsItem.innerHTML = `
                        <p class="info-title">Clouds:</p>
                        <p class="info-text">${forecast.clouds.all}%</p>
                    `;
                    weatherInfo.appendChild(cloudsItem);

                forecastCard.appendChild(weatherInfo);
                forecastList.appendChild(forecastCard);
            });

        } catch (error) {
            forecastList.innerHTML = '<p>Unable to load forecast data</p>';
        }
    }

// Search Functions
    // Handle Search Function
    async function handleSearch() {
        const address = searchInput.value;

        if (!address) {
            showModal('Please enter a city');
            return;
        }

        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(address)}&limit=1&appid=${key}`;

        try {
            const response = await fetch(geoUrl);
            if (!response.ok) throw new Error('Geocoding fetch failed');

            const geoData = await response.json();

            if (geoData.length === 0) {
                showModal(`Could not find location: ${address}`);
                return
            }

            const {lat, lon, name} = geoData[0];

            localStorage.setItem('weatherLocation', JSON.stringify({ lat, lon, name }));

            showWeatherDisplay();
            loadWeatherNow(lat, lon);
            loadWeatherForecast(lat, lon);

        } catch (error) {
            showModal("An error occurred while searching for the location.");
        }
    }

// Handling the Allow Location button
    async function handleAllowLocationClick() {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;

                // Load all the functions of weather
                showWeatherDisplay();
                loadWeatherNow(latitude, longitude);
                loadWeatherForecast(latitude, longitude);

            } catch (error) {
                showModal("Location access was denied. Please use the search bar to find a city.");
            }
        }

// Hiding the location prompt and displaying the cards
    function showWeatherDisplay() {
        locationPrompt.classList.add('hidden');
        weatherContainer.classList.remove('hidden');
    }
    
// Page Initialization
function initializePage() {
    const storedLocation = localStorage.getItem('weatherLocation');

    if(storedLocation) {
        const { lat, lon } = JSON.parse(storedLocation);
        showWeatherDisplay();
        loadWeatherNow(lat, lon);
        loadWeatherForecast(lat, lon);
    }
}


// Event Listeners  // VIDEO COMMENT: Event listeners

// Search Event Listener
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


// Closing Modal Event
modalCloseButton.addEventListener('click', closeModal);
// Closing by clicking on the backdrop
modal.addEventListener("click", e => {
    const dialogDimensions = modal.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close()
    }
  })

// listening for the click to trigger the function
allowLocationButton.addEventListener('click', handleAllowLocationClick);

// Mobile Nav-bar
const hamburguer = document.getElementById('hamburguer'); 

hamburguer.addEventListener('click', () => {
    const mobileItems = document.getElementById('mobileItems');
    if (mobileItems.classList.contains('hidden')) {
        mobileItems.classList.remove('hidden');
    } else {
        mobileItems.classList.add('hidden');
    }
});

// Getting Year for the Copyright text
const date = new Date();
const currentYear = date.getFullYear();
const year = document.getElementById('year')
year.textContent = currentYear;

initializePage();