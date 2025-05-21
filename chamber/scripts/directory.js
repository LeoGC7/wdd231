// Getting the year
    const year = new Date().getFullYear();
    const currentYear = document.getElementById('currentYear');
    currentYear.textContent = year;

// Getting the lastt updated date
    const update = new Date();
    const lastUpdate = document.getElementById('lastUpdate');

    const formattedDate = `${(update.getMonth() + 1).toString().padStart(2, '0')}/${update.getDate().toString().padStart(2, '0')}/${update.getFullYear()} ${update.getHours().toString().padStart(2, '0')}:${update.getMinutes().toString().padStart(2, '0')}:${update.getSeconds().toString().padStart(2, '0')}`;

    lastUpdate.textContent = formattedDate;


async function loadCompanies() {
    //Companies elements
    const companiesList = document.getElementById('companiesList');

    members.forEach(company => {
        // Company div
            const companyDiv = document.createElement('div');
            companyDiv.classList.add('company')

        // Membership
            const membershipContainer = document.createElement('div');
            membershipContainer.classList.add('membership-container');

            const membership = document.createElement('p');
            membership.classList.add('company-membership');

            if (company.membership === 1) {
                membership.classList.add('member');
                membership.textContent = 'Member';

            } else if (company.membership === 2) {
                membership.classList.add('silver');
                membership.textContent = 'Silver';

            } else {
                membership.classList.add('gold');
                membership.textContent = 'Gold';
            }

            membershipContainer.appendChild(membership);
            companyDiv.appendChild(membershipContainer);

        // Data div
            const data = document.createElement('div');
            data.classList.add('data')
            companyDiv.appendChild(data);

        // Image
            const image = document.createElement('img');
            image.src = company.image;
            image.alt = 'company-logo';
            image.classList.add('company-image');
            data.appendChild(image);

        // Info div
            const info = document.createElement('div');
            info.classList.add('info');
            data.appendChild(info);

        // Address
            const address = document.createElement('p');
            address.classList.add('company-address');
            address.textContent = company.address;
            info.appendChild(address);

        // Phone
            const phone = document.createElement('p');
            phone.classList.add('company-phone');
            phone.textContent = company.phone;
            info.appendChild(phone);

        // Website
            const website = document.createElement('p');
            website.classList.add('company-website');
            website.textContent = company.website;
            info.appendChild(website);
            
    companiesList.appendChild(companyDiv);
    });
}

// Toggle list view
    const grid = document.getElementById('grid');
    grid.classList.add('active');

    const list = document.getElementById('list');

    // Grid button
    grid.addEventListener('click', () => {
        companiesList.classList.remove('list');
        list.classList.remove('active');
        grid.classList.add('active');

        const companies = document.querySelectorAll('.company');
        companies.forEach(company => {
            company.classList.remove('list');
        });
    });

    // List button
    list.addEventListener('click', () => {
        companiesList.classList.add('list');
        grid.classList.remove('active');
        list.classList.add('active');

        const companies = document.querySelectorAll('.company');
        companies.forEach(company => {
            company.classList.add('list');
        });
    })

loadCompanies();