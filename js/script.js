// API Key - 273a1e8dfc4471421a0b08ea09bd7387
// API Call - http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=273a1e8dfc4471421a0b08ea09bd7387
let city = document.querySelector("#city-search");
let searchButton = document.querySelector("#search");
let fiveDayObj = {};
let incorrect = document.querySelector(".incorrect");
let wrongText = "Invalid City";

let previousSearch = [];

function store(search) {
  previousSearch.push(search);
  console.log(previousSearch, "Saved")
  localStorage.setItem("Previous Search", previousSearch);
}

function showPreviousSearch() {
  let previousValue = [localStorage.getItem("Previous Search")];
  let previousDiv = document.querySelector(".city");
  let eachButtonContainer = document.createElement("div");
  for (let i = 0; i < previousValue.length; i++) {
    eachButtonContainer.innerHTML = `
    <button class="previous-button">${previousValue[i]}</button>`
  }
  previousDiv.append(eachButtonContainer)
}

function getGeo(cityName) {
  let text = city.value;
  store(text);
  showPreviousSearch();
  let key = "010cc554e8087064e8910c4a2aa44a43";
  let limit = 1;
  cityName = text;

  let url =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=" +
    limit +
    "&appid=" +
    key;

  fetch(url)
    .then((response) => {
      console.log(response);
      console.log(response.status);
      return response.json();
    })
    .then(function (data) {
      // console.log(data[0].lon, "data")
      incorrect.innerHTML = "";
      let geo = {
        longitude: data[0].lon,
        latitude: data[0].lat,
      };

      fetchWeather(geo.longitude, geo.latitude);
      fiveDay(geo.longitude, geo.latitude);
    })
    .catch((error) => {
      incorrect.innerHTML = wrongText;
    });
}

//     GoogleMaps Key = AIzaSyBR9nvY5J9vWyirr1JXTyw-timn_5RHvlA
function fetchWeather(lon, lat) {
  //use the values from city to fetch the weather
  let key = "010cc554e8087064e8910c4a2aa44a43";
  console.log(lat);
  let lang = "en";
  let units = "metric";
  let url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    key +
    "&units=" +
    units +
    "&lang=" +
    lang;
  //fetch the weather
  fetch(url)
    .then((response) => {
      console.log(response.status);
      // if(!resp.ok) throw new Error(resp.statusText);
      return response.json();
    })
    .then((data) => {
      let cityAttributes = {
        temp: data.current.temp,
        wind: data.current.wind_speed,
        humidity: data.current.humidity,
        clouds: data.current.clouds,
      };
      // console.log(data.current.humidity, "humidity")
      // console.log(data, "second set data")
      showWeather(cityAttributes);
    })
    .catch(console.err);
}

function fiveDay(lon, lat) {
  let key = "010cc554e8087064e8910c4a2aa44a43";
  let url =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    key;

  fetch(url)
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      const timeOfDay = "12:00:00";
      const list = data.list.filter((datum) =>
        datum.dt_txt.includes(timeOfDay)
      );

      for (let i = 0; i < list.length; i++) {
        let dayData = list[i];
        let changeFormat = new Date(dayData.dt_txt);
        let dateFormat = changeFormat.getMonth() + " / " + changeFormat.getDate() + " / " + changeFormat.getFullYear();
         let fiveDayObj = {
            tempMin: dayData.main.temp_min,
            tempMax: dayData.main.temp_max,
            humidityDaily: dayData.main.humidity,
            icon: dayData.weather[0].icon,
            currentCondition: dayData.weather[0].main,
            date: dateFormat,
          };
          console.log(fiveDayObj, "date check");

        let eachDay = document.querySelector(".day");
        let eachContainer = document.createElement("div");
        eachContainer.setAttribute("class", "card");
        let renderIcon =
          "http://openweathermap.org/img/wn/" + fiveDayObj.icon + "@2x.png";

        eachContainer.innerHTML = `
                <p class="words" id="date">${fiveDayObj.date}</p>
                <div class="words" id="icon"><img src="${renderIcon}"></div>
                <div class="words">Condition: ${fiveDayObj.currentCondition}</div>
                <div class="words">Min Temp: ${fiveDayObj.tempMin}</div>
                <div class="words">Max Temp: ${fiveDayObj.tempMax}</div>
                <div class="words">Humidity: ${fiveDayObj.humidityDaily}</div>`;
        eachDay.appendChild(eachContainer);
        console.log(fiveDayObj.tempMin, "w00t");
      }
    })
    .catch(console.err);
}

function showWeather(attr) {
  let cityLocation = document.querySelector(".current-city");
  cityLocation.innerHTML = city.value;
  console.log(attr);
  let clouds = document.querySelector("#clouds");
  let temp = document.querySelector("#temp");
  let windSpeed = document.querySelector("#wind-speed");
  let humidity = document.querySelector("#humidity");
  let cloudText = attr.temp;
  let tempText = attr.temp;
  let windText = attr.wind;
  let humidText = attr.humidity;
  clouds.innerHTML = cloudText;
  temp.innerHTML = tempText;
  windSpeed.innerHTML = windText;
  humidity.innerHTML = humidText;
}

// function showFiveDay(attr) {
//         let tempMin = attr.tempMin;
//         let tempMax = attr.tempMax;
//         let dayBox = attr.date;
//         // let dayBox2 = new Date(dayBox);
//         let currentCondition = attr.currentCondition;
//         let icon = attr.icon;
//         let humidityDaily = attr.humidityDaily;
//         // console.log(dayBox2.getMonth()+1, dayBox2.getDay(), "iso");

//         let minTemp = document.querySelector(".min");
//         let maxTemp = document.querySelector(".max");
//         let iconWeather = document.querySelector("#icon");
//         let condition = document.querySelector(".condition");
//         let date = document.querySelector("#date");
//         let humidity5 = document.querySelector(".humidity5");

//         minTemp.innerHTML = tempMin;
//         maxTemp.innerHTML = tempMax;
//         date.innerHTML = dayBox;
//         condition.innerHTML = currentCondition;
//         iconWeather.innerHTML = icon;
//         humidity5.innerHTML = humidityDaily;

// }
// MAP SORT FILTER
//     getLocation: (ev) => {
//         let opts = {
//             enableHighAccuracy: true,
//             timeout: 1000 * 10, // 10 Seconds
//             maximumAge: 1000 * 60 * 5, // 5 Minutes
//         };
//         navigator.geolocation.getCurrentPosition(app.ftw, app.wtf, opts);
//     },
//     ftw: (position) => {
//     //got position
//     document.querySelector('#city-search');
//     position.coords.latitude.toFixed(2);

// },

//     wtf: (err) => {
//         //geolocation failed
//         console.error(err);
//     },

//     showWeather: (resp) => {
//         console.log(resp)
//         let row = document.querySelector('.weather.row');
//         //clear out the old weather and add the new
//     }
// };

// app.init();

searchButton.addEventListener("click", getGeo);
