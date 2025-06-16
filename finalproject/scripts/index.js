// DOM Elements
const key = '5f666d0a454737f9bd70ace0543b52b9';
const searchInput = document.getElementById('addressSearch');
const searchButton = document.querySelector('.search-button');

// Load Weather Functions
    // Live Weather
    async function loadWeatherNow(lat, lon) {
        const urlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

        try {
            const response = await fetch(urlNow);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            // City
                const city = document.getElementById('city');
                city.innerText = data.name;

            // Icon
                const image = document.getElementById('weatherImg');
                image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            // Description
                const description = document.getElementById('description');
                description.innerText = data.weather[0].description;
            
            // Temperature
                const temperature = document.getElementById('temperature');
                temperature.innerText = `${Math.round(data.main.temp)}°C`;

            // Feels Like
                const feelsLike = document.getElementById('feelsLike');
                feelsLike.innerText = `${data.main.feels_like}°C`

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
            console.log('Error: ', error);
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

            const forecasts = data.list.filter(item => {
                const forecastDate = new Date(item.dt * 1000);
                return forecastDate.getHours() === 12;
            }).slice(0, 3);

            forecastList.innerHTML = '';

            forecasts.forEach(forecast => {
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

                // Temperature
                    const weatherInfo = document.createElement('div');
                    weatherInfo.classList.add('weather-info');

                    const tempItem = document.createElement('div');
                    tempItem.classList.add('weather-info-item');

                    const tempTitle = document.createElement('p');
                    tempTitle.classList.add('info-title');
                    tempTitle.innerText = 'Temperature:';

                    const tempValue = document.createElement('p');
                    tempValue.classList.add('info-text');
                    tempValue.innerText = `${Math.round(forecast.main.temp)}°C`; // Rounded for consistency

                    tempItem.appendChild(tempTitle);
                    tempItem.appendChild(tempValue);
                    weatherInfo.appendChild(tempItem);
                    forecastCard.appendChild(weatherInfo);

                // Feels Like
                    const feelsLikeItem = document.createElement('div');
                    feelsLikeItem.classList.add('weather-info-item');
                    const feelsLikeTitle = document.createElement('p');
                    feelsLikeTitle.classList.add('info-title');
                    feelsLikeTitle.innerText = 'Feels Like:';
                    const feelsLikeValue = document.createElement('p');
                    feelsLikeValue.classList.add('info-text');
                    feelsLikeValue.innerText = `${Math.round(forecast.main.feels_like)}°C`;
                    feelsLikeItem.appendChild(feelsLikeTitle);
                    feelsLikeItem.appendChild(feelsLikeValue);
                    weatherInfo.appendChild(feelsLikeItem);

                // Humidity
                const humidityItem = document.createElement('div');
                    humidityItem.classList.add('weather-info-item');
                    const humidityTitle = document.createElement('p');
                    humidityTitle.classList.add('info-title');
                    humidityTitle.innerText = 'Humidity:';
                    const humidityValue = document.createElement('p');
                    humidityValue.classList.add('info-text');
                    humidityValue.innerText = `${forecast.main.humidity}%`;
                    humidityItem.appendChild(humidityTitle);
                    humidityItem.appendChild(humidityValue);
                    weatherInfo.appendChild(humidityItem);

                // Clouds
                    const cloudsItem = document.createElement('div');
                    cloudsItem.classList.add('weather-info-item');
                    const cloudsTitle = document.createElement('p');
                    cloudsTitle.classList.add('info-title');
                    cloudsTitle.innerText = 'Clouds:';
                    const cloudsValue = document.createElement('p');
                    cloudsValue.classList.add('info-text');
                    cloudsValue.innerText = `${forecast.clouds.all}%`;
                    cloudsItem.appendChild(cloudsTitle);
                    cloudsItem.appendChild(cloudsValue);
                    weatherInfo.appendChild(cloudsItem);

                forecastList.appendChild(forecastCard);
            });

        } catch (error) {
            console.error('Error fetching the forecast:', error);
            forecastList.innerHTML = '<p>Unable to load forecast data</p>';
        }
    }

// Search Functions
    // Get Local Coordinates
    function getCoordinates() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        })
    }

    // Hanlde Search Function
    async function handleSearch() {
        const address = searchInput.value;

        if (!address) {
            alert('Please enter a city or address');
            return;
        }

        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(address)}&limit=1&appid=${key}`;

        try {
            const response = await fetch(geoUrl);
            if (!response.ok) throw new Error('Geocoding fetch failed');

            const geoData = await response.json();

            if (geoData.length === 0) {
                alert(`Could not find location: ${address}`);
                return
            }

            const {lat, lon} = geoData[0];

            loadWeatherNow(lat, lon);
            loadWeatherForecast(lat, lon);

        } catch (error) {
            console.log('Error: ', error);
            alert("An error occurred while searching for the location.")
        }
    }

    // Calling LoadWeather Functions
    async function initializeApp() {
        try {
            const position = await getCoordinates();
            const { latitude, longitude } = position.coords;
            
            loadWeatherNow(latitude, longitude);
            loadWeatherForecast(latitude, longitude);

        } catch (error) {
            console.log('Geolocation permission denied or failed.', error);
            alert("Location access denied. Please allow location access or use the search bar.");
        }
    }

    // Search Event Listener
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

// Mobile Nav-bar
const mobileItems = document.getElementById('mobileItems');
const hamburguer = document.getElementById('hamburguer');

function ShowItems() {
    if (mobileItems.classList.contains('hidden')) {
        mobileItems.classList.remove('hidden');
    } else {
        mobileItems.classList.add('hidden');
    }
}

// Getting Year fot the Copyright text
const date = new Date();
const currentYear = date.getFullYear();
const year = document.getElementById('year')
year.textContent = currentYear;

// Start the application on page load
initializeApp();