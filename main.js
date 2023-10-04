// API key and base URL for OpenWeatherMap API
const apiKey = '8fcca1709cbbedbaf8998124bf910108'
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='

// DOM elements
const searchBox = document.querySelector('.search input')
const searchBtn = document.querySelector('.search button')
const weatherIcon = document.querySelector('.weather-icon')
const favWeatherIcon = document.querySelector('.fav-weather')
const cardModal = document.querySelector('.card')
const modalBackground = document.createElement('div')

// Create a modal background for the card
modalBackground.classList.add('modal-background')
document.body.appendChild(modalBackground)

function getDayOfWeek(dateString) {
    const options = { weekday: 'short' }
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', options)
}
function getHourFromDate(dateString) {
    const date = new Date(dateString)
    const hour = date.getHours()
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const ampmHour = hour % 12 === 0 ? 12 : hour % 12
    return `${ampmHour}${ampm}`
}


const apiForecast = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&q='
async function checkWeatherForecast(city) {
    const response = await fetch(apiForecast + city + `&appid=${apiKey}`)

    if (response.status == 404) {
        alert(`${searchBox.value} is not a City`)
    } else {
        let data = await response.json()
        if (data.hasOwnProperty('list')) {
            data.list.forEach((item, index) => {
                const backCard = document.querySelector('.back')
                const div = document.createElement('div')
                div.classList.add('forecast')
                div.innerHTML = `
                <div class="flex justify-between">
                    <p class="fdate">${getDayOfWeek(item.dt_txt)}</p>
                    <p class="fdatetime">${getHourFromDate(item.dt_txt)}</p>
                </div>
                <img class="fimg" src="${getWeatherIcon(item.weather[0].main)}" alt="${(item.weather[0].description)}">
                <p class="fdescription">${item.weather[0].main}</p>
                <p class="ftemp">${Math.round(item.main.temp)}°C</p>`

                backCard.appendChild(div)
            })
        } else {
            console.log('Not found')
        }
    }
}

// Function to check weather for a given city
async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`)

    if (response.status == 404) {
        alert(`${searchBox.value} is not a City`)
    } else {
        let data = await response.json()

        document.querySelector('.city').innerHTML = `${data.name}`
        document.querySelector('.country').innerHTML = `, ${data.sys.country}`
        document.querySelector('.description').innerHTML = (function(description) {
            return description.charAt(0).toUpperCase() + description.slice(1)
        })(data.weather[0].description)
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C'
        document.querySelector('#humidity').innerHTML = data.main.humidity + '%'
        document.querySelector('#wind').innerHTML = data.wind.speed + ' km/h'

        let weatherIconSrc = 'img/unknown.svg'
        switch (data.weather[0].main) {
            case 'Clouds':
                weatherIconSrc = 'img/cloudy.svg'
                break
            case 'Clear':
                weatherIconSrc = 'img/clear.svg'
                break
            case 'Rain':
                weatherIconSrc = 'img/rain.svg'
                break
            case 'Drizzle':
                weatherIconSrc = 'img/drizzle.svg'
                break
            case 'Mist':
                weatherIconSrc = 'img/mist.svg'
                break
            case 'Thunderstorm':
                weatherIconSrc = 'img/thunder.svg'
                break
            case 'Haze':
                weatherIconSrc = 'img/haze.svg'
                break
            case 'Snow':
                weatherIconSrc = 'img/snow.svg'
                break
            case 'Fog':
                weatherIconSrc = 'img/fog.svg'
                break
            default:
                weatherIconSrc = 'img/unknown.svg'
                break
        }

        weatherIcon.src = weatherIconSrc

        cardModal.style.display = 'block'
        cardModal.classList.add('modal-overlay')
        modalBackground.style.display = 'block'
    }
}

// Function to hide the modal
function hideModal() {
    cardModal.style.display = 'none'
    modalBackground.style.display = 'none'
}

// Close the modal when the 'Escape' key is pressed
document.onkeydown = function(e) {
    if (e.key === 'Escape') {
        hideModal()
    }
}

// Prevent modal closure when clicking inside it
cardModal.addEventListener('click', function(event) {
    event.stopPropagation()
})

// Close the modal when clicking outside it
document.addEventListener('click', function(event) {
    if (event.target !== cardModal && !cardModal.contains(event.target)) {
        hideModal()
    }
})

// Function to handle the search
function handleSearch() {
    checkFav()
    checkWeather(searchBox.value)
    checkWeatherForecast(searchBox.value)
}

// Event listener for the "Enter" key in the search input
searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
})

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    handleSearch()
})

// Event listener for the favorite icon click
favWeatherIcon.addEventListener('click', () => {
    const cityName = document.querySelector('.city').textContent
    addToFavorites(cityName)
    getForecastForCity(cityName)
})

// Function to add or remove a city from favorites
function addToFavorites(cityName) {
    let favorites = localStorage.getItem('favorites')
    if(!favorites) {
        favorites = []
    } else {
        favorites = JSON.parse(favorites)
    }

    if (favorites.includes(cityName)) {
        favorites = favorites.filter(city => city !== cityName)
        localStorage.setItem('favorites', JSON.stringify(favorites))
        console.log(`${cityName} eliminated from your favorites`)
        removeFromHomeboard(cityName)
    } else {
        favorites.push(cityName)
        localStorage.setItem('favorites', JSON.stringify(favorites))
        console.log(`${cityName} added to your favorites`)
        addToHomeboard(cityName)
    }

    checkFav()
}

// Function to remove a city card from the homeboard section
function removeFromHomeboard(cityName) {
    const section = document.querySelector('.homeboard')
    const cityElement = section.querySelector(`[data-city="${cityName}"]`)
    if (cityElement) {
        cityElement.remove()
    }
}

// Function to make an API call and add a city card to the homeboard
function addToHomeboard(cityName) {
    $.ajax({
        url:apiUrl + cityName + `&appid=${apiKey}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displayWeatherInfo(data)
        },
        error: function(error) {
            console.log(`Error ${cityName}: ${error}`)
        }
    })
    console.log(`addToHomeboard: Adding city to homeboard - ${cityName}`)
}

// Function to remove diacritics from city names
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

// Function to check if a city is in favorites local storage
function checkFav() {
    const favorites = localStorage.getItem('favorites')

    if (favorites) {
        const favoritesList = JSON.parse(favorites).map(city => removeAccents(city.toLowerCase()))     
        const cityName = removeAccents(searchBox.value.toLowerCase())

        if (favoritesList.includes(cityName)) {
            favWeatherIcon.src = 'img/fav-red.svg'
        } else {
            favWeatherIcon.src = 'img/fav.svg'
        }
    }
}

// Load and display weather for cities in favorites local storage
const favorites = localStorage.getItem('favorites')
const elementOrder = JSON.parse(localStorage.getItem('elementOrder'))
if (favorites) {
    const elementOrder = JSON.parse(localStorage.getItem('elementOrder'))

    if (favorites && elementOrder) {
        const apiCalls = elementOrder.map(cityName => {
            if (favorites.includes(cityName)) {
                return fetch(apiUrl + cityName + `&appid=${apiKey}`)
                        .then(response => response.json())
                        .then(data => {
                            return {cityName, data}
                        })
                        .catch(error => {
                            console.error(`Error ${cityName}: ${error}`)
                            return null
                        })
            }
            return null
        })

        Promise.all(apiCalls)
            .then(cityDataArray => {
                const validCityDataArray = cityDataArray.filter(cityData => cityData !== null)
                validCityDataArray.forEach(({cityName, data}) => {
                    displayWeatherInfo(data)
                    getForecastForCity(cityName)
                })
            })
            .catch(error => {
                console.log('Promise call eror', error)
            })
    }
}

// Weather conditions backgrounds
const weatherBackgrounds = {
    'Clouds': 'url(img/cloudy-nm.svg)',
    'Clear': 'url(img/clear-nm.svg)',
    'Rain': 'url(img/rain-nm.svg)',
    'Drizzle': 'url(img/drizzle-nm.svg)',
    'Mist': 'url(img/mist-nm.svg)',
    'Thunderstorm': 'url(img/thunder-nm.svg)',
    'Haze': 'url(img/haze-nm.svg)',
    'Snow': 'url(img/snow-nm.svg)',
    'Fog': 'url(img/fog-nm.svg)',
    'Unknown': 'url(img/unknown.svg)'
}

// Function to display weather information for a city on the homeboard
function displayWeatherInfo(data) {
    const section = document.querySelector('.homeboard')
    const div = document.createElement('div')
    div.classList.add('favorite-card')
    div.setAttribute('data-city', data.name)
    div.setAttribute('data-id', data.name)

    const capitalizedDescription = (function(description) {
        return description.charAt(0).toUpperCase() + description.slice(1)
    })(data.weather[0].description)

    div.innerHTML = `
        <img src="img/fav.svg" class="fav-weather" alt="Favorite">
        <div class="weather">
            <div class="pictures">
                <img src="${getWeatherIcon(data.weather[0].main)}" class="weather-icon" alt="${data.weather[0].description}">
            </div>
            <h1 class="temp cursor-default">${Math.round(data.main.temp)}°C</h1>
            <h2 class="city inline-block cursor-default">${data.name}</h2>
            <h2 class="country inline-block cursor-default">, ${data.sys.country}</h2>
            <p class="description">${capitalizedDescription}</p>
            <div class="details">
                <div class="col cursor-default">
                    <img src="img/humidity.png" alt="Humidity percentage">
                    <div>
                        <p>Humidity</p>
                        <p>${data.main.humidity}%</p>
                    </div>
                </div>
                <div class="col cursor-default">
                    <img src="img/wind.png" alt="Wind speed">
                    <div>
                        <p>Wind Speed</p>
                        <p>${data.wind.speed} km/h</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="back">
            <h2>5 day / 3 hour Forecast</h2>
        </div>
        `
    
        const favWeatherElement = div.querySelector('.fav-weather')
        const cityName = data.name
    
        const favorites = localStorage.getItem('favorites')
        if (favorites) {
            const favoritesList = JSON.parse(favorites).map(city => removeAccents(city.toLowerCase()))
    
            if (favoritesList.includes(removeAccents(cityName.toLowerCase()))) {
                favWeatherElement.src = 'img/fav-red.svg'
            }
        }
    
        favWeatherElement.addEventListener('click', () => {
            addToFavorites(cityName)
    
            if (favWeatherElement.src.includes('fav.svg')) {
                favWeatherElement.src = 'img/fav-red.svg'
            } else {
                favWeatherElement.src = 'img/fav.svg'
                removeFromFavorites(cityName)
            }
        })
    
    section.appendChild(div)

    // Update elementOrder based on the current order of city cards
    const draggableElements = document.querySelectorAll('.favorite-card')
    const order = Array.from(draggableElements).map(element => element.dataset.id)
    const uniqueOrder = [... new Set(order)]
    localStorage.setItem('elementOrder', JSON.stringify(uniqueOrder))
}

// Function to remove a city card from favorites
function removeFromFavorites(cityName) {
    const elementToRemove = document.querySelector(`.favorite-card[data-city="${cityName}"]`)
    if (elementToRemove) {
        elementToRemove.remove()
    }
}

// Function to get the weather icon based on weather description
function getWeatherIcon(weatherDescription) {
    switch (weatherDescription) {
        case 'Clouds':
        return 'img/cloudy.svg'
        case 'Clear':
        return 'img/clear.svg'
        case 'Rain':
        return 'img/rain.svg'
        case 'Drizzle':
        return 'img/drizzle.svg'
        case 'Mist':
        return 'img/mist.svg'
        case 'Haze':
        return 'img/haze.svg'
        case 'Thunderstorm':
        return 'img/thunder.svg'
        case 'Snow':
        return 'img/snow.svg'
        case 'Fog':
        return 'img/fog.svg'
        default:
        return 'img/unknown.svg'
    }
}

// Function to get forecast for a city
async function getForecastForCity(cityName) {
    try {
        const response = await fetch(apiForecast + cityName + `&appid=${apiKey}`)

        if (response.status == 404) {
            console.log(`${cityName} is not a City`)
        } else {
            const data = await response.json()
            if (data.hasOwnProperty('list')) {
                const cityContainer = document.querySelector(`.favorite-card[data-city="${cityName}"] .back`)
                data.list.forEach((item, index) => {
                    const div = document.createElement('div')
                    div.classList.add('forecast')
                    div.innerHTML = `
                    <div class="flex flex-wrap justify-between">
                        <p class="fdate">${getDayOfWeek(item.dt_txt)}</p>
                        <p class="fdatetime">${getHourFromDate(item.dt_txt)}</p>
                    </div>
                    <img class="fimg" src="${getWeatherIcon(item.weather[0].main)}" alt="${(item.weather[0].description)}">
                    <p class="fdescription">${item.weather[0].main}</p>
                    <p class="ftemp">${Math.round(item.main.temp)}°C</p>`

                    cityContainer.appendChild(div)
                })
            } else {
                console.log(`No forecast found for ${cityName}`)
            }
        }
    } catch (error) {
        console.error(`Error fetching forecast for ${cityName}: ${error}`)
    }
}

function dragAndDrop(){
    const homeboard = document.querySelector('#dragparent')
    const drake = dragula([homeboard])

    drake.on('drop', function() {
        const draggableElements = document.querySelectorAll('.favorite-card')
        const order = Array.from(draggableElements).map(element => element.dataset.id)

        const uniqueOrder = [...new Set(order)]
        localStorage.setItem('elementOrder', JSON.stringify(uniqueOrder))
    })

}

window.onload = dragAndDrop;

let isMouseDown = false

document.addEventListener('mousedown', () => {
  isMouseDown = true
})

document.addEventListener('mousemove', () => {
  if (isMouseDown) {
    const backElements = document.querySelectorAll('.back')
    backElements.forEach((backElement) => {
        backElement.style.display = 'none'
      })
  }
})

document.addEventListener('mouseup', () => {
    isMouseDown = false
    const backElements = document.querySelectorAll('.back')
    backElements.forEach((backElement) => {
        backElement.style.display = ''
      })
  })

const toggleTheme = document.querySelector('.toggle')
const body = document.body

const savedTheme = localStorage.getItem('theme')

if (savedTheme) {
    body.classList.add(savedTheme)
} if (savedTheme === 'dark-theme') {
    toggleTheme.src = 'img/light.svg'
} else {
    toggleTheme.src = 'img/night.svg'
}

toggleTheme.onclick = function() {
    body.classList.toggle('dark-theme')
    if(body.classList.contains('dark-theme')) {
        toggleTheme.src = 'img/light.svg'
        localStorage.setItem('theme', 'dark-theme')
    } else {
        toggleTheme.src = 'img/night.svg'
        localStorage.setItem('theme', 'light-theme')
    }
}
  


