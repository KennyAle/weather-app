const apiKey = '8fcca1709cbbedbaf8998124bf910108'
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='

const searchBox = document.querySelector('.search input')
const searchBtn = document.querySelector('.search button')
const weatherIcon = document.querySelector('.weather-icon')
const favWeatherIcon = document.querySelector('.fav-weather')

const cardModal = document.querySelector('.card')
const modalBackground = document.createElement('div')
modalBackground.classList.add('modal-background')
document.body.appendChild(modalBackground)

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`)

    if (response.status == 404) {
        alert(`${searchBox.value} is not a City`)
    } else {
        let data = await response.json()

        document.querySelector('.city').innerHTML = data.name
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C'
        document.querySelector('.humidity').innerHTML = data.main.humidity + '%'
        document.querySelector('.wind').innerHTML = data.wind.speed + ' km/h'

        if (data.weather[0].main === 'Clouds') {
            weatherIcon.src = 'img/cloudy.svg'
        } else if (data.weather[0].main === 'Clear') {
            weatherIcon.src = 'img/clear.svg'
        } else if (data.weather[0].main === 'Rain') {
            weatherIcon.src = 'img/rain.svg'
        } else if (data.weather[0].main === 'Drizzle') {
            weatherIcon.src = 'img/drizzle.svg'
        } else if (data.weather[0].main === 'Mist') {
            weatherIcon.src = 'img/mist.svg'
        }

        document.querySelector('.card').style.display = 'block'
        document.querySelector('.card').classList.add('modal-overlay')
        modalBackground.style.display = 'block'
    }
}

function hideModal() {
    document.querySelector('.card').style.display = 'none'
    modalBackground.style.display = 'none'
}

document.querySelector('.card').addEventListener('click', function(event) {
    event.stopPropagation()
})

document.addEventListener('click', function(event) {
    const card = document.querySelector('.card');
    if (event.target !== card && !card.contains(event.target)) {
        hideModal()
    }
})

function handleSearch() {
    checkFav()
    checkWeather(searchBox.value)
}

searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
})

searchBtn.addEventListener('click', () => {
    handleSearch()
})

favWeatherIcon.addEventListener('click', () => {
    const cityName = document.querySelector('.city').textContent

    addToFavorites(cityName)
})

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
    } else {
        favorites.push(cityName)
        localStorage.setItem('favorites', JSON.stringify(favorites))
        console.log(`${cityName} added to your favorites`)
    }

    checkFav()
}


function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function checkFav() {
    const favorites = localStorage.getItem('favorites')

    if (favorites) {
        const favoritesList = JSON.parse(favorites).map(city => removeAccents(city.toLowerCase()))     
        const cityName = removeAccents(searchBox.value.toLowerCase())

        console.log('Favorites List:', favoritesList);

        if (favoritesList.includes(cityName)) {
            favWeatherIcon.src = 'img/fav-red.svg'
        } else {
            favWeatherIcon.src = 'img/fav.svg'
        }
    }
}

const favorites = localStorage.getItem('favorites')
if (favorites) {
    const favoritesList = JSON.parse(favorites)

    favoritesList.forEach(cityName => {
        fetch(apiUrl + cityName + `&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                displayWeatherInfo(data)
            })
            .catch(error => {
                console.error(`Error ${cityName}: ${error}`)
            })
    })
}

function displayWeatherInfo(data) {
    console.log(data)
    const section = document.querySelector('.homeboard');
    const div = document.createElement('div')
    div.classList.add('favorite-card')
    div.setAttribute('data-city', data.name)
    div.innerHTML = `
        <div class="weather">
            <picture>
                <img src="${getWeatherIcon(data.weather[0].main)}" class="weather-icon" alt="${data.weather[0].main}">
                <img src="img/fav.svg" class="fav-weather" alt="Favorite">
            </picture>
            <h1 class="temp">${Math.round(data.main.temp)}°C</h1>
            <h2 class="city">${data.name}</h2>
            <div class="details">
                <div class="col">
                    <img src="img/humidity.png">
                    <div>
                        <p class="humidity"></p>
                        <p>${data.main.humidity}%</p>
                    </div>
                </div>
                <div class="col">
                    <img src="img/wind.png">
                    <div>
                        <p class="wind"></p>
                        <p>${data.wind.speed} km/h</p>
                    </div>
                </div>
            </div>
        </div>`
    
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
}

function removeFromFavorites(cityName) {
    const elementToRemove = document.querySelector(`.favorite-card[data-city="${cityName}"]`)
    if (elementToRemove) {
        elementToRemove.remove()
    }
}

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
        default:
        return 'img/unknown.svg'
    }
}

