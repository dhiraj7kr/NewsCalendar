// script.js

// Initialize global variables
let currentDate = new Date();
let tasks = {};

// Functions to handle Calendar
function renderCalendar() {
    const monthYear = document.getElementById('month-year');
    const calendarTable = document.getElementById('calendar-table');

    // Get month and year
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Set month and year text
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    // Create calendar headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let headerRow = '<tr>';
    daysOfWeek.forEach(day => {
        headerRow += `<th>${day}</th>`;
    });
    headerRow += '</tr>';
    calendarTable.innerHTML = headerRow;

    // Get first day of the month and number of days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    // Create days cells
    let daysRow = '<tr>';
    for (let i = 0; i < firstDay; i++) {
        daysRow += '<td class="inactive"></td>';
    }
    for (let day = 1; day <= numDays; day++) {
        const todayClass = (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) ? 'today' : '';
        daysRow += `<td class="${todayClass}" data-date="${year}-${month + 1}-${day}">${day}</td>`;
        if ((firstDay + day) % 7 === 0) {
            daysRow += '</tr><tr>';
        }
    }
    daysRow += '</tr>';
    calendarTable.innerHTML += daysRow;

    // Add event listeners to days
    document.querySelectorAll('#calendar-table td').forEach(cell => {
        cell.addEventListener('click', function() {
            const date = this.getAttribute('data-date');
            showTodoSection(date);
        });
    });
}

function showTodoSection(date) {
    document.getElementById('todo-section').style.display = 'block';
    document.getElementById('quotes-section').style.display = 'none';
    document.getElementById('main-content').setAttribute('data-current-date', date);
    renderTasks(date);
}

// Render tasks for a specific date
function renderTasks(date) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    if (tasks[date]) {
        tasks[date].forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.textContent = `${task.time} - ${task.description}`;
            todoList.appendChild(taskDiv);
        });
    }
}

// Add new task
document.getElementById('add-todo').addEventListener('click', function() {
    const date = document.getElementById('main-content').getAttribute('data-current-date');
    const description = document.getElementById('todo-input').value;
    const time = new Date().toLocaleTimeString(); // Use current time for simplicity

    if (!tasks[date]) {
        tasks[date] = [];
    }

    tasks[date].push({ description, time });
    document.getElementById('todo-input').value = ''; // Clear input
    renderTasks(date);
});

// Navigation links
document.getElementById('todo-link').addEventListener('click', function() {
    document.getElementById('todo-section').style.display = 'block';
    document.getElementById('quotes-section').style.display = 'none';
});

document.getElementById('quotes-link').addEventListener('click', function() {
    document.getElementById('todo-section').style.display = 'none';
    document.getElementById('quotes-section').style.display = 'block';
});

// Navigation buttons for calendar
document.getElementById('prev-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Initial render
renderCalendar();

const API_KEY = 'a2823b8b78054cf9948be2c46a18b560'; // Your NewsAPI key

// Fetch news from the API
async function fetchNews() {
    try {
        const techNewsResponse = await fetch(`https://newsapi.org/v2/everything?q=tech&apiKey=${API_KEY}`);
        const techNewsData = await techNewsResponse.json();
        renderTechNews(techNewsData.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Render tech news items
function renderTechNews(techNewsItems) {
    const techNewsList = document.getElementById('tech-news-list');
    
    // Clear previous news
    techNewsList.innerHTML = '';

    // Render tech news
    techNewsItems.forEach(item => {
        const newsDiv = document.createElement('div');
        newsDiv.className = 'news-item';
        newsDiv.innerHTML = `
            <img src="${item.urlToImage || 'https://via.placeholder.com/150'}" alt="${item.title}">
            <div class="news-content">
                <h4 class="news-title">${item.title}</h4>
                <p class="news-description">${item.description || ''}</p>
                <p class="news-source">Source: ${item.source.name}</p>
            </div>
        `;
        techNewsList.appendChild(newsDiv);
    });
}

// Initial fetch
fetchNews();
// Existing code
