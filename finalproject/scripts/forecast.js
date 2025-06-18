document.addEventListener('DOMContentLoaded', () => {
    const key = '5f666d0a454737f9bd70ace0543b52b9';
    const forecastDisplay = document.getElementById('forecastDisplay');
    const searchInput = document.getElementById('addressSearch');
    const searchButton = document.querySelector('.search-button');

// Load hourly Forecast
    async function loadHourlyForecast(lat, lon) {
        if (!lat || !lon) {
            forecastDisplay.innerHTML = `<p class="error-message">Could not find location data. Please search for a city.</p>`;
            return;
        }

        const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

        try {
            const response = await fetch(urlForecast);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const data = await response.json();
            displayForecast(data);

        } catch (error) {
            console.error('Error fetching the forecast:', error);
            forecastDisplay.innerHTML = '<p class="error-message">Unable to load forecast data. Please try again later.</p>';
        }
    }

// Display forecast data
    function displayForecast(data) {
        forecastDisplay.innerHTML = '';

        // Displaying the City Name
        const cityName = data.city.name;
        document.querySelector('.search-result').innerText = `5-Day Hourly Forecast for ${cityName}`;
        
        // Grouping forecasts by day
        const forecastsByDay = data.list.reduce((acc, forecast) => {
            const date = forecast.dt_txt.split(' ')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(forecast);
            return acc;
        }, {});

        // Making a card for each day
        for (const date in forecastsByDay) {
            const dayForecasts = forecastsByDay[date];

            // Forecast Card
            const dayCard = document.createElement('div');
            dayCard.className = 'forecast-card';

            // Forecast Title
            const title = document.createElement('p');
            title.className = 'forecast-card-title';
            const forecastDate = new Date(`${date}T00:00:00`); // Use T00:00:00 to avoid timezone issues
            const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
            const monthDay = forecastDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            title.textContent = `${dayName} - ${monthDay}`;
            dayCard.appendChild(title);
            
            // Weather Cards
            const weatherCardsContainer = document.createElement('div');
            weatherCardsContainer.className = 'weather-cards';

            // Forecast Card
            dayForecasts.forEach(forecast => {
                const card = document.createElement('div');
                card.className = 'card';

                const hour = new Date(forecast.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                const temp = `${Math.round(forecast.main.temp)}°C`;
                const iconSrc = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                const description = forecast.weather[0].description;
                const rain = (forecast.rain && forecast.rain['3h']) ? `${forecast.rain['3h']} mm` : '0 mm';

                // Using innerHTML to be easier instead of appendchild();
                card.innerHTML = `
                    <p class="card-hour">${hour}</p>
                    <p class="card-temperature">${temp}</p>
                    <div class="card-icon-container">
                        <img src="${iconSrc}" alt="${description}" class="card-image">
                        <p class="card-description">${description}</p>
                    </div>
                    <div class="forecast-info">
                        <div class="forecast-info-item">
                            <p class="forecast-info-title">Rain (3h):</p>
                            <p class="forecast-info-text">${rain}</p>
                        </div>
                    </div>
                `;
                weatherCardsContainer.appendChild(card);
            });

            dayCard.appendChild(weatherCardsContainer);
            forecastDisplay.appendChild(dayCard);
        }
    }

// Search Function
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
                return;
            }

            const { lat, lon, name } = geoData[0];
            localStorage.setItem('weatherLocation', JSON.stringify({ lat, lon, name }));
            loadHourlyForecast(lat, lon);

        } catch (error) {
            console.error('Error during search:', error);
            alert("An error occurred while searching for the location.");
        }
    }

// Getting data from the LocalStorage
    function initializeApp() {
        const savedLocation = localStorage.getItem('weatherLocation');
        if (savedLocation) {
            const { lat, lon } = JSON.parse(savedLocation);
            loadHourlyForecast(lat, lon);
        } else {
            forecastDisplay.innerHTML = `<p class="error-message">Welcome! Please search for a city on the <a href="index.html">Home</a> page to see the detailed forecast.</p>`;
        }

        // Event Listener
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
    }

// Mobile Nav-bar
    const mobileItems = document.getElementById('mobileItems');
    const hamburguer = document.getElementById('hamburguer');
    window.ShowItems = function() { // Attach to window to make it accessible from HTML onclick
        mobileItems.classList.toggle('hidden');
    }

// Footer Year
    document.getElementById('year').textContent = new Date().getFullYear();

// Start the application
    initializeApp();
});