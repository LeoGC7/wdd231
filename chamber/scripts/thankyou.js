document.addEventListener('DOMContentLoaded', () => {
    // Getting the Div element where the items will be displayed
    const formDataDisplay = document.getElementById('formDataDisplay');
    
    // Creating a SearchParams
    const params = new URLSearchParams(window.location.search);

    // Getting Form Information
    const labels = {
        fname: "First Name",
        lname: "Last Name",
        orgTitle: "Organizational Title",
        email: "Email Address",
        phone: "Mobile Phone",
        businessName: "Business Name",
        businessDesc: "Business Description",
        membershipLevel: "Membership Level",
        formTimestamp: "Submission Time"
    };

    // Extracting the Information from the form
    params.forEach((value, key) => {
        if (labels[key] && value) {
            const dataItem = document.createElement('div');
            dataItem.classList.add('data-item');

            if (key === 'businessDesc') {
                dataItem.classList.add('description-item');
            }

            let displayValue = value;

            if (key === 'formTimestamp') {
                const date = new Date(value);

                const options = {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                };

                displayValue = new Intl.DateTimeFormat('en-US', options).format(date);
            }

            dataItem.innerHTML = `<strong>${labels[key]}:</strong> <span>${decodeURIComponent(displayValue)}</span>`;
            
            formDataDisplay.appendChild(dataItem);
        }
    });
});
