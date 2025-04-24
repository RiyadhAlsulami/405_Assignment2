// DOM Elements
const randomUserBtn = document.getElementById('random-user-btn');
const universityBtn = document.getElementById('university-btn');
const universitySearch = document.getElementById('university-search');
const randomUserControls = document.getElementById('random-user-controls');
const universityInput = document.getElementById('university-input');
const searchBtn = document.getElementById('search-btn');
const generateUserBtn = document.getElementById('generate-user-btn');
const resultsContainer = document.getElementById('results');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// API URLs
const RANDOM_USER_API = 'https://randomuser.me/api/';
const UNIVERSITY_API = 'http://universities.hipolabs.com/search?name=';

// Current API state
let currentApi = null;

// Event Listeners
randomUserBtn.addEventListener('click', () => {
    switchToApi('random-user');
});

universityBtn.addEventListener('click', () => {
    switchToApi('university');
});

searchBtn.addEventListener('click', () => {
    const query = universityInput.value.trim();
    if (query) {
        searchUniversities(query);
    } else {
        showError('Please enter a university name');
    }
});

universityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

generateUserBtn.addEventListener('click', fetchRandomUser);

// Function to switch between APIs
function switchToApi(api) {
    currentApi = api;
    clearResults();
    
    if (api === 'random-user') {
        universitySearch.style.display = 'none';
        randomUserControls.style.display = 'block';
        fetchRandomUser();
    } else if (api === 'university') {
        randomUserControls.style.display = 'none';
        universitySearch.style.display = 'block';
        universityInput.focus();
    }
}

// Function to fetch random user data
async function fetchRandomUser() {
    showLoading();
    
    try {
        const response = await fetch(RANDOM_USER_API);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        displayRandomUser(data.results[0]);
    } catch (error) {
        showError(`Failed to fetch random user: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Function to search universities
async function searchUniversities(query) {
    showLoading();
    
    try {
        const response = await fetch(`${UNIVERSITY_API}${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            showError(`No universities found matching "${query}"`);
        } else {
            displayUniversities(data);
        }
    } catch (error) {
        showError(`Failed to search universities: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Function to display random user data
function displayRandomUser(user) {
    const html = `
        <div class="user-card">
            <img src="${user.picture.large}" alt="User Image" class="user-image">
            <div class="user-info">
                <h3 class="user-name">${user.name.first} ${user.name.last}</h3>
                <ul class="user-details">
                    <li><strong>Email:</strong> ${user.email}</li>
                    <li><strong>Phone:</strong> ${user.phone}</li>
                    <li><strong>Gender:</strong> ${user.gender}</li>
                    <li><strong>Age:</strong> ${user.dob.age}</li>
                    <li><strong>Location:</strong> ${user.location.city}, ${user.location.country}</li>
                </ul>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = html;
}

// Function to display universities
function displayUniversities(universities) {
    const html = `
        <h3>Found ${universities.length} universities</h3>
        <ul class="university-list">
            ${universities.map(uni => `
                <li class="university-item">
                    <div class="university-name">${uni.name}</div>
                    <div class="university-country">${uni.country}</div>
                    ${uni.web_pages && uni.web_pages.length > 0 ? 
                        `<a href="${uni.web_pages[0]}" target="_blank" class="university-website">Visit Website</a>` : 
                        ''}
                </li>
            `).join('')}
        </ul>
    `;
    
    resultsContainer.innerHTML = html;
}

// Utility functions
function showLoading() {
    loadingIndicator.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function clearResults() {
    resultsContainer.innerHTML = '';
    errorMessage.style.display = 'none';
}

// Initialize the app with random user API
switchToApi('random-user');
