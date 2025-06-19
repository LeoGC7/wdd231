document.addEventListener('DOMContentLoaded', () => {
    // Getting the form display div
    const formDataDisplay = document.getElementById('formDataDisplay');

    // Creating a SearchParams
    const params = new URLSearchParams(window.location.search);

    // Getting form information
    const labels = {
        name: "Full Name",
        email: "Email",
        phone: "Phone",
        message: "Your Message"
    };

    // Extracting the Information from the form
    params.forEach((value, key) => {
        if (labels[key] && value) {
            const dataItem = document.createElement('div');
            dataItem.classList.add('data-item');

            let displayValue = value;

            dataItem.innerHTML = `
            <span class="data-name">${labels[key]}: </span>
            <p class="data-value" id="${key + "Sub"}" >${decodeURIComponent(displayValue)}</p>
            `

            formDataDisplay.appendChild(dataItem);
        }
    })
})