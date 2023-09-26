const apiKey = '8fcca1709cbbedbaf8998124bf910108'
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='

const searchBox = document.querySelector('.search input')
const searchBtn = document.querySelector('.search button')
const weatherIcon = document.querySelector('.weather-icon')
const favWeatherIcon = document.querySelector('.fav-weather')

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
            weatherIcon.src = 'img/clear.png'
        } else if (data.weather[0].main === 'Rain') {
            weatherIcon.src = 'img/rain.png'
        } else if (data.weather[0].main === 'Drizzle') {
            weatherIcon.src = 'img/drizzle.png'
        } else if (data.weather[0].main === 'Mist') {
            weatherIcon.src = 'img/mist.png'
        }

        document.querySelector('.card').style.display = 'block'
    }
}

searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeather(searchBox.value)
    }
})

searchBtn.addEventListener('click', ()=> {
    checkWeather(searchBox.value)
})

function addToFavorites(cityName) {
    let favorites = localStorage.getItem('favorites')
    if(!favorites) {
        favorites = []
    } else {
        favorites = JSON.parse(favorites)
    }

    if (!favorites.includes(cityName)) {
        favorites.push(cityName)
        localStorage.setItem('favorites', JSON.stringify(favorites))
        console.log(`${cityName} ha sido agregado a tus favoritas`)
    } else {
        console.log(`${cityName} ya esta en tus favoritas`)
    }
}

function checkFav() {
    const favorites = localStorage.getItem('favorites')

    if (favorites) {
        const favoritesList = JSON.parse(favorites).map(city => city.toLowerCase())     
        const cityName = searchBox.value.toLowerCase()

        console.log('Favorites List:', favoritesList);
        console.log('City Name:', cityName);

        if (favoritesList.includes(cityName)) {
            favWeatherIcon.src = 'img/fav-red.svg'
        } else {
            favWeatherIcon.src = 'img/fav.svg'
        }
    }
}
