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