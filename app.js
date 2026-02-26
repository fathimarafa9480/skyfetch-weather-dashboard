
// Your OpenWeatherMap API Key
function weatherApp() {
this.API_KEY = '7da5d60962cc54bce0bc071a3a84e684';  // Replace with your actual API key
this.API_URL = 'https://api.openweathermap.org/data/2.5/weather';

/* PART 2: UI ELEMENT REFERENCES*/
this.searchBtn = document.getElementById('search-btn');
this.cityInput = document.getElementById('city-input');
this.displayArea = document.getElementById('weather-display');

this.init();
}

WeatherApp.prototype.init = function() {
    // TODO: Add click event listener to search button
    // Use .bind(this) to maintain context
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));
    
    // TODO: Add keypress event listener to input
    // Listen for Enter key
    this.cityInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    });
    
    // TODO: Display welcome message
    // Call a method like this.showWelcome()
    this.showWelcome();
}

WeatherApp.prototype.showWelcome = function() {
    // TODO: Create welcome HTML
    const welcomeHTML = `
        <div class="welcome-message">
            <!-- TODO: Add icon or emoji -->
            <!-- TODO: Add welcome heading -->
            <!-- TODO: Add instruction text -->
        </div>

        <div class="welcome-message" style="text-align: center; padding: 20px;">
            <div style="font-size: 48px;">🌤️</div>
            <h2> Welcome to crative App </h2>
            <p>Enter a city name in the search box above to check the current weather.</p>
        </div>
    `;
    
    // TODO: Display in weather display area
    // this.weatherDisplay.innerHTML = welcomeHTML;
};


/* PART 2: REFACTORED FETCH FUNCTION (Async/Await)*/
async function getWeather(city) {
    // Show loading state immediately
    showLoading();
    
    // Disable UI during fetch
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await axios.get(url);
        console.log('Weather Data:', response.data);
        
        // Success! Display data (Part 1 function)
        displayWeather(response.data);
        
        // Part 2: Focus back on input for next search
        cityInput.focus();
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        // Part 2: Advanced Error Handling
        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please check your connection.');
        }
    } finally {
        // Re-enable UI
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
    }
}

/* PART 1: DISPLAY FUNCTION (Slightly modified for Part 2)*/

function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    displayArea.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
}

/* PART 2: NEW UI HELPER FUNCTIONS*/

function showLoading() {
    displayArea.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather...</p>
        </div>
    `;
}

function showError(message) {
    displayArea.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

/* PART 2: EVENT LISTENERS*/


function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name is too short.');
        return;
    }

    getWeather(city);
    cityInput.value = ''; // Clear input after search
}