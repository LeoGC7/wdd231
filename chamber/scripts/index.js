// Weather Live
async function loadWeatherNow() {
    const weatherDiv = document.getElementById('weatherInfo');
    const lat = -23.5489;
    const lon = -46.6388;
    const key = '5f666d0a454737f9bd70ace0543b52b9';
    const urlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

    try {
        const response = await fetch(urlNow);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Extracting and Displaying weather data
        const icon = document.createElement('img');
        icon.classList.add('info');
        icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Icon
            const iconContainer = document.createElement('div');
            iconContainer.classList.add('icon-container');
            iconContainer.appendChild(icon);
            weatherDiv.appendChild(iconContainer);

        // City Name
            const city = document.createElement('p');
            city.classList.add('info');
            city.appendChild(document.createTextNode('City: '));
            const cityName = document.createElement('span');
            cityName.innerText = data.name;
            city.appendChild(cityName);
            weatherDiv.appendChild(city);

        // Temperature
            const temp = document.createElement('p');
            temp.classList.add('info');
            temp.appendChild(document.createTextNode('Temperature: '));
            const tempValue = document.createElement('span');
            tempValue.innerText = `${data.main.temp}°C`;
            temp.appendChild(tempValue);
            weatherDiv.appendChild(temp);
        
        // Description
            const desc = document.createElement('p');
            desc.classList.add('info');
            desc.appendChild(document.createTextNode('Description: '));
            const descText = document.createElement('span');
            descText.innerText = data.weather[0].description;
            desc.appendChild(descText);
            weatherDiv.appendChild(desc);

    } catch (error) {
        console.error('Error fetching the weather:', error);
        displayParagraph.innerText = 'Unable to load weather data';
    }
}

// Weather 3-day forecast
async function loadWeatherForecast() {
    const forecastList = document.getElementById('weatherForecastInfo');
    const lat = -23.5489;
    const lon = -46.6388;
    const key = '5f666d0a454737f9bd70ace0543b52b9';
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

    try {
        const response = await fetch(urlForecast);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        // Filtering for one forecast per day at noon
        const forecasts = data.list.filter(item => {
            const forecastDate = new Date(item.dt * 1000);
            return forecastDate.getHours() === 12;
        }).slice(0, 3);

        // Clearing existing content
        forecastList.innerHTML = '';

        // Creating forecast items
        forecasts.forEach(forecast => {
            const forecastDate = new Date(forecast.dt * 1000);
            const day = forecastDate.getDate().toString().padStart(2, '0');
            const month = forecastDate.toLocaleString('en-US', { month: 'short' });

            const forecastDiv = document.createElement('div');
            forecastDiv.classList.add('forecast-day');

            // Icon
            const icon = document.createElement('img');
            icon.classList.add('info');
            icon.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

            const iconContainer = document.createElement('div');
            iconContainer.classList.add('icon-container');
            iconContainer.appendChild(icon);
            forecastDiv.appendChild(iconContainer);

            // Date
            const date = document.createElement('p');
            date.classList.add('info');
            date.appendChild(document.createTextNode('Date: '));
            const dataValue = document.createElement('span');
            dataValue.innerText = `${month}/${day}`;
            date.appendChild(dataValue);
            forecastDiv.appendChild(date);

            // Temperature
            const temp = document.createElement('p');
            temp.classList.add('info');
            temp.appendChild(document.createTextNode('Temperature: '));
            const tempValue = document.createElement('span');
            tempValue.innerText = `${forecast.main.temp}°C`;
            temp.appendChild(tempValue);
            forecastDiv.appendChild(temp);

            // Description
            const desc = document.createElement('p');
            desc.classList.add('info');
            desc.appendChild(document.createTextNode('Description: '));
            const descSpan = document.createElement('span');
            descSpan.innerText = forecast.weather[0].description;
            desc.appendChild(descSpan);
            forecastDiv.appendChild(desc);

            // Appending to forecast list
            forecastList.appendChild(forecastDiv);
        });

    } catch (error) {
        console.error('Error fetching the forecast:', error);
        forecastList.innerHTML = '<p>Unable to load forecast data</p>';
    }
}

// Companies
async function loadCompanies() {
    //Companies elements
    const companiesList = document.getElementById('companiesList');

    // Selecting just the Silver and Gold companies
    const eligibleCompanies = members.filter(company =>
        company.membership === 2 || company.membership === 3
    );

    // Mixing the companies
    const mixed = eligibleCompanies.sort(() => 0.5 - Math.random());

    // Chossing the first 5 companies
    const selectedCompanies = mixed.slice(0, 5);

    selectedCompanies.forEach(company => {
        const companyDiv = document.createElement('div');
        companyDiv.classList.add('company');

        const membershipContainer = document.createElement('div');
        membershipContainer.classList.add('membership-container');

        const membership = document.createElement('p');
        membership.classList.add('company-membership');

        if (company.membership === 2) {
            membership.classList.add('silver');
            membership.textContent = 'Silver';
        } else {
            membership.classList.add('gold');
            membership.textContent = 'Gold';
        }

        membershipContainer.appendChild(membership);
        companyDiv.appendChild(membershipContainer);

        const data = document.createElement('div');
        data.classList.add('data');
        companyDiv.appendChild(data);

        const image = document.createElement('img');
        image.src = company.image;
        image.alt = 'company-logo';
        image.classList.add('company-image');
        data.appendChild(image);

        const name = document.createElement('p');
        name.classList.add('company-name', 'hidden');
        name.textContent = company.name;
        data.appendChild(name);

        const info = document.createElement('div');
        info.classList.add('info');
        data.appendChild(info);

        const address = document.createElement('p');
        address.classList.add('company-address');
        address.textContent = company.address;
        info.appendChild(address);

        const phone = document.createElement('p');
        phone.classList.add('company-phone');
        phone.textContent = company.phone;
        info.appendChild(phone);

        const website = document.createElement('p');
        website.classList.add('company-website');
        website.textContent = company.website;
        info.appendChild(website);

        companiesList.appendChild(companyDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadWeatherNow();
    loadWeatherForecast();
    loadCompanies();
});














































async function loadEvents() {
    // Events elements
    const eventsList = document.getElementById('eventsList');
    
    const baseDate = new Date();

    events.forEach((event, index) => {
        // Event Div
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');

        // Event Image
        const eventImg = document.createElement('img');
        eventImg.classList.add('event-image');
        eventImg.alt = 'event-image';
        eventImg.src = event.image;
        eventDiv.appendChild(eventImg);

        // Event Title
        const eventTitle = document.createElement('p');
        eventTitle.classList.add('event-title');
        eventTitle.textContent = event.title;
        eventDiv.appendChild(eventTitle);

        // Event Date
        const eventDate = new Date(baseDate);
        eventDate.setDate(baseDate.getDate() + (index * 2));
        const day = eventDate.getDate().toString().padStart(2, '0');
        const month = eventDate.toLocaleString('en-US', { month: 'short' });
        const time = event.time;
        const eventTime = document.createElement('p');
        eventTime.classList.add('event-time');
        eventTime.textContent = `${month}/${day} - ${time}`;
        eventDiv.appendChild(eventTime);

        // Event Speaker
        const eventSpeaker = document.createElement('p');
        eventSpeaker.classList.add('event-speaker');
        eventSpeaker.textContent = event.speaker;
        eventDiv.appendChild(eventSpeaker);

        // Append Event
        eventsList.appendChild(eventDiv);
    });
}

loadEvents();