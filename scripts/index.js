// Getting the year
const year = new Date().getFullYear();
const currentYear = document.getElementById('currentYear');
currentYear.textContent = year;

// Getting the lastt updated date
const update = new Date();
const lastUpdate = document.getElementById('lastUpdate');

const formattedDate = `${(update.getMonth() + 1).toString().padStart(2, '0')}/${update.getDate().toString().padStart(2, '0')}/${update.getFullYear()} ${update.getHours().toString().padStart(2, '0')}:${update.getMinutes().toString().padStart(2, '0')}:${update.getSeconds().toString().padStart(2, '0')}`;

lastUpdate.textContent = formattedDate;

// Getting elements from th HTML
const certificateContent = document.querySelector('.certificate-content');
const allButton = document.getElementById('all');
const wddButton = document.getElementById('wdd');
const cseButton = document.getElementById('cse');

// Function to get and display courses information
function displayCourses(courseList) {
  certificateContent.innerHTML = '';

  const creditsNumber = document.getElementById('creditsNumber');

  courseList.forEach(course => {
    const courseDisplay = course.subject + ' ' + course.number;
    const courseOnHtml = document.createElement('p');
    courseOnHtml.className = 'course';

    if (course.completed === true) {
      courseOnHtml.classList.add('completed');
    }

    courseOnHtml.innerText = courseDisplay;
    certificateContent.appendChild(courseOnHtml);
  });

  const totalCredits = courseList.reduce((total, course) => total + course.credits, 0);
  creditsNumber.textContent = totalCredits;
}

function setActiveButton(button) {
  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.classList.remove('filter-active');
  });

  button.classList.add('filter-active');
}

// Event listeners to select courses dinamically
allButton.addEventListener('click', () => {
  displayCourses(courses);
  setActiveButton(allButton);
});

wddButton.addEventListener('click', () => {
  const wddCourses = courses.filter(course => course.subject === 'WDD');
  displayCourses(wddCourses);
  setActiveButton(wddButton);
});

cseButton.addEventListener('click', () => {
  const cseCourses = courses.filter(course => course.subject === 'CSE');
  displayCourses(cseCourses);
  setActiveButton(cseButton);
});

displayCourses(courses);