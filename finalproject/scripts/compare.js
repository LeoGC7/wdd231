document.addEventListener('DOMContentLoaded', () => {
    const key = '5f666d0a454737f9bd70ace0543b52b9'; 

    const city1Input = document.getElementById('searchCity1');
    const city2Input = document.getElementById('searchCity2');
    const compareButton = document.getElementById('compareButton');

    /**
     * Fetching and Displaying data for a single city based on the name and it's index
     * @param {string} cityName - City name
     * @param {number} cardIndex - The index of the corresponding HTML card
     */
    async function getAndDisplayWeather(cityName, cardIndex) {
        // Selecting elements of the card using it's index
        const cityTitle = document.getElementById(`city${cardIndex}`);
        const temperature = document.getElementById(`temperature${cardIndex}`);
        const weatherImg = document.getElementById(`weatherImg${cardIndex}`);
        const description = document.getElementById(`description${cardIndex}`);
        const rain = document.getElementById(`rain${cardIndex}`);
        const feelsLike = document.getElementById(`feelsLike${cardIndex}`);
        const humidity = document.getElementById(`humidity${cardIndex}`);
        const clouds = document.getElementById(`clouds${cardIndex}`);
        
        // Showing a loading
        cityTitle.innerText = `Loading ${cityName}...`;
        temperature.innerText = '';
        description.innerText = '';

        try {
            // Getting the coordinates based on the city name
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${key}`;
            const geoResponse = await fetch(geoUrl);
            if (!geoResponse.ok) throw new Error(`Network error for ${cityName}`);

            const geoData = await geoResponse.json();

            if (geoData.length === 0) {
                throw new Error(`Could not find: ${cityName}`);
            }

            const { lat, lon } = geoData[0];

            // Getting the weather based on the coordinates
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) throw new Error(`Weather fetch failed for ${cityName}`);
            const data = await weatherResponse.json();

            // Creating the Card based on the data received
            cityTitle.innerText = `${data.name}, ${data.sys.country}`;
            temperature.innerText = `${Math.round(data.main.temp)}°C`;
            weatherImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            description.innerText = data.weather[0].description;
            rain.innerText = (data.rain && data.rain['1h']) ? `${data.rain['1h']} mm` : '0 mm';
            feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`;
            humidity.innerText = `${data.main.humidity}%`;
            clouds.innerText = `${data.clouds.all}%`;

        } catch (error) {
            console.error(error);
            cityTitle.innerText = error.message;
        }
    }

    // Search function for the compare button
    function SearchCompare() {
        const city1 = city1Input.value.trim();
        const city2 = city2Input.value.trim();

        if (!city1 || !city2) {
            alert('Please enter a name for both cities.');
            return;
        }

        // Display the weather for the current cities
        getAndDisplayWeather(city1, 1);
        getAndDisplayWeather(city2, 2);
    }

    // Starting the search when the button is clicked
    compareButton.addEventListener('click', SearchCompare);

    // Handling the Enter Key
    city1Input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') SearchCompare();
    });
    city2Input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') SearchCompare();
    });
    
    // Mobile Nav-bar
    const mobileItems = document.getElementById('mobileItems');
    window.ShowItems = function() {
        mobileItems.classList.toggle('hidden');
    }

    // Footer Year
    document.getElementById('year').textContent = new Date().getFullYear();
});