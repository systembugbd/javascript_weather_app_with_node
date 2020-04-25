const CURRENTTIME = document.getElementById('currentTime');
const faviconIcon = document.getElementById('faviconIcon');
const banner_part_dynamic_img = document.getElementById('banner_part_dynamic_img');
const DTIME = document.getElementById('dateTime');
const ICON = document.getElementById('icon');
const ICON2 = document.getElementById('icon2');
const LOCATION = document.getElementById('location');
const DETAILS = document.getElementById('details');
const DETAILSHISTORY = document.getElementById('details2');
const WIND = document.getElementById('wind');
const DESCRIPTION = document.getElementById('description');

const TEMP = document.getElementById('temp');
const PRESSURE = document.getElementById('pressure');
const HUMIDITY = document.getElementById('humidity');

const weatherInputForm = document.getElementById('weatherInputForm');
const weatherInputFormByBtn = document.getElementById('weatherInputFormByBtn');

const USERINPUTVAL = document.getElementById('userInput').value;
const HISTORYHEADING = document.getElementById('historyHeading');
const MASTERHISTORY = document.getElementById('masterHistory');

const API_KEY = '82a46e63e22536d84a755f88b68cace3';
const BASE_API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;
const BASE_URL_ICON = 'http://openweathermap.org/img/wn'; //http://openweathermap.org/img/wn/50d@2x.png;

const DEFAULT_CITY = USERINPUTVAL == '' ? "dhaka" : USERINPUTVAL;
const BASE_URL_WETHER_ICON_GIF = 'https://www.animatedimages.org/data/media/148/animated-weather-image-00';

const GOOGLE_MAP_BASE = `https://www.google.com/maps/embed/v1/MODE?key=YOUR_API_KEY&parameters`;



window.onload = function () {

    navigator.geolocation.getCurrentPosition(geo => {

        getWeatherData(null, geo.coords);

    }, e => {
        getWeatherData(DEFAULT_CITY);
       console.log(e);
    });
   
    axios.get('/api/history')
        .then(({ data }) => {
          
            if(data.length > 0){
                updateHistory(data);
               
            }else{
                HISTORYDETAILS.innerHTML = 'There is no history found';
            }
        }) 
        .catch(e => {
            console.log(e.message);
            alert('Error Occurred at "/api/history route" ' + e.message ); 
        });

    weatherInputFormByBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (weatherInputForm.value != '') {
            getWeatherData(weatherInputForm.value);
            weatherInputForm.value = '';
        } else {
            alert('Please Enter Your Desired Location,');
        }
    });

    weatherInputForm.addEventListener('keypress', function (e) {

        if (e.key === 'Enter') {
            if (e.target.value) {
                getWeatherData(e.target.value.trim(), null, weather=>{
                    e.target.value = '';
                    axios.port('/api/history', weather)
                        .then(({data}) => {
                            updateHistory(data);
                        })
                        .catch(e => {
                            console.log(e);
                            alert('Error Occourred');
                        });

                });
                e.target.value = '';
            } else {
                alert('Please Enter Your Desired Location,');
            }

        }
    });

};

function updateHistory(history){
     DETAILSHISTORY.innerHTML = "" ;
     history = history.reverse();
     let CL  = parseFloat(history.temp - 273.15).toFixed(2);
     let min = parseFloat(history.temp_min - 273.15).toFixed(2);
     let max = parseFloat(history.temp_max - 273.15).toFixed(2);
     let FL  = parseFloat(history.feels_like - 273.15).toFixed(2);

     
     history.forEach(h => {
         
            ICON2.src =`${BASE_URL_ICON}/${h.icon}@2x.png`;
            DETAILSHISTORY.innerHTML =  `${h.name}, ${h.country} | Lat: ${h.lat}, Lon: ${h.lon} <br>
            <b style="color:#bd08ff">Now ${h.main}</b>, Temparature: ${CL} °C, <br> 
            Pressure: ${h.pressure}, Humidity: ${h.humidity}%, <br>
            Wind Speed : ${h.speed}km/h & degree ${h.deg} °<br> 
            Temparature Min: ${min} °C, Max: ${max} °C, <br>
            Feels Like: ${FL} °C`;
 
     });
}


function getWeatherData(city, coords, cb) {
    let url = BASE_API_URL;

    url = city == null ?`${url}&lat=${coords.latitude}&lon=${coords.longitude}` : `${url}&q=${city}`;

    // console.log(url);

    axios.get(url).then(res => {

        let weather = {
            id: res.data.id,
            icon: res.data.weather[0].icon,
            name: res.data.name,
            lon: res.data.coord.lon,
            lat: res.data.coord.lat,
            main: res.data.weather[0].main,
            temp: res.data.main.temp,
            description: res.data.weather[0].description,
            feels_like: res.data.main.feels_like,
            temp_min: res.data.main.temp_max,
            temp_max: res.data.main.temp_max,
            pressure: res.data.main.pressure,
            humidity: res.data.main.humidity,
            speed: res.data.wind.speed,
            deg: res.data.wind.deg,
            country: res.data.sys.country,
            sunrise: res.data.sys.sunrise,
            sunset: res.data.sys.sunset
        };

        setWeatherInfo(weather);
        if(cb) cb(weather);

    }).catch(e => {
        console.log(e);
        alert("Weather Info is not available of your desired location, Please type your correct location");
    });


}

function setWeatherInfo(weather) {
    let CL  = parseFloat(weather.temp - 273.15).toFixed(2);
    let min = parseFloat(weather.temp_min - 273.15).toFixed(2);
    let max = parseFloat(weather.temp_max - 273.15).toFixed(2);
    let FL  = parseFloat(weather.feels_like - 273.15).toFixed(2);

    ICON.src = `${BASE_URL_ICON}/${weather.icon}@2x.png`;

    let weatherIcon = {
        '01d': 'clear_sky',
        '02d': 'broken_clouds',
        '03d': 'scattered_clouds',
        '04d': 'few_clouds',
        '09d': 'shower_rain',
        '10d': 'rain',
        '11d': 'thunderstorm',
        '13d': 'snow',
        '50d': 'mist',
        '01n': 'clear_sky',
        '02n': 'few clouds',
        '03n': 'scattered_clouds',
        '04n': 'broken_clouds',
        '09n': 'shower_rain',
        '10n': 'rain',
        '11n': 'thunderstorm',
        '13n': 'snow',
        '50n': 'mist'
    };

    let icons = '';
    for (let key in weatherIcon) {

        if (weather.icon == key) {
            icons = weatherIcon[key];
        }

    }

    banner_part_dynamic_img.style.backgroundImage = icons ? `url(img/weather/${icons}.jpg)` : `url(img/banner_bg.png)`;
    banner_part_dynamic_img.style.backgroundSize = "cover";
    banner_part_dynamic_img.style.backgroundPosition = "center bottom";
    banner_part_dynamic_img.style.backgroundColor = "rgb(11, 0, 255)";

    DTIME.innerHTML = new Date().toDateString();
    faviconIcon.href = `${BASE_URL_ICON}/${weather.icon}@2x.png`;


    DETAILS.innerHTML =
        `${weather.name}, ${weather.country} | Lat: ${weather.lat}, Lon: ${weather.lon} <br>
        <b style="color:#bd08ff">Now ${weather.main}</b>, Temparature: ${CL} °C, <br> 
        Pressure: ${weather.pressure}, Humidity: ${weather.humidity}%, <br>
        Wind Speed : ${weather.speed}km/h & degree ${weather.deg} °<br> 
        Temparature Min: ${min} °C, Max: ${max} °C, <br>
        Feels Like: ${FL} °C`;


}

function getTime() {
    var digitalClock = new Date();
    CURRENTTIME.innerHTML = digitalClock.toLocaleTimeString();

}

setInterval(getTime, 1000);
