document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('message');

    const lastVisit = localStorage.getItem('lastVisit');

    const currentDate = new Date();

    if (!lastVisit) {
        const message = document.createElement('p');
        message.textContent = 'Welcome! Let us know if you have any questions.'
        message.classList.add('message-sample');
        messageContainer.appendChild(message);
    } else {
        const lastVisitDate = new Date(lastVisit);

        const timeDifference = currentDate.getTime() - lastVisitDate.getTime();

        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference < 1) {
            const message = document.createElement('p');
            message.textContent = 'Back so soon! Awesome!'
            message.classList.add('message-sample');
            messageContainer.appendChild(message);
        } else {
            const dayText = daysDifference === 1 ? 'day' : 'days';
            const message = document.createElement('p');
            message.textContent = `You last visited ${daysDifference} ${dayText} ago`;
            message.classList.add('message-sample');
            messageContainer.appendChild(message);
        }
    }

    localStorage.setItem('lastVisit', currentDate.toString());
})

const cardsDiv = document.getElementById('cardsContainer');

async function loadLocations() {
    const response = await fetch('data/locations.json');
    if(response.ok) {
        const data = await response.json();
        DisplayCards(data);
    } else {
        console.error('Could not load the locations data');
    }
}

function DisplayCards(locations) {
    locations.forEach(location => {
        const card = document.createElement('div');
        card.classList.add('card');

        const figure = document.createElement('figure');
        figure.classList.add('card-figure');
        
        const img = document.createElement('img');
        img.src = location.image;
        img.alt = location.name;
        img.loading = 'lazy';
        figure.appendChild(img);
        
        card.appendChild(figure);

        const cardInfoDiv = document.createElement('div');
        cardInfoDiv.classList.add('card-info');
        card.appendChild(cardInfoDiv);

        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = location.name;
        cardInfoDiv.appendChild(cardTitle);

        const cardAddress = document.createElement('address');
        cardAddress.classList.add('card-address');
        cardAddress.textContent = location.address;
        cardInfoDiv.appendChild(cardAddress);

        const cardDesc = document.createElement('p');
        cardDesc.classList.add('card-desc');
        cardDesc.textContent = location.description;
        cardInfoDiv.appendChild(cardDesc);

        const button = document.createElement('button');
        button.classList.add('card-button');
        button.textContent = 'Learn More';
        cardInfoDiv.appendChild(button);

        cardsDiv.appendChild(card);
    });
}

loadLocations()