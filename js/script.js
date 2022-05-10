let city = document.querySelector("#city-search");
let searchButton = document.querySelector(".button-search");
let fiveDayObj = {};
let incorrect = document.querySelector(".incorrect");
let wrongText = "Invalid City";
let previousValue = [];
let eachDay = document.querySelector(".day");
let searchedCity = [];
let previousDiv = document.querySelector(".city"); // Grab where the previous searches will go
let recentDiv = document.querySelector(".recent"); // Grab where the recent searches will 
let cityLocation = document.querySelector(".current-city");

// Stores in local storage.
function store(search) {
  // searchedCity = JSON.parse(
  //   localStorage.getItem("Previous-Search" || "[]")
  // );
  console.log(search, "whit")
  searchedCity.push(search);
  console.log("here  we are")
  localStorage.setItem("Previous-Search", JSON.stringify(searchedCity));
  // console.log(search,searchedCity,  "s")
  console.log("went ot the set", localStorage);
  renderNew(search);
}

// Grab from local storage and get the previous searches.
function showPreviousSearch() {
  let getSave = localStorage.getItem("Previous-Search");
  if (getSave) {
    searchedCity = JSON.parse(getSave);
  }
  searchedCity.reverse();
  renderHistory(searchedCity);
}

// Make a function that will render the most recent searches as they are typed.
function renderNew(value) {
  let eachButtonContainer = document.createElement("button");
  eachButtonContainer.setAttribute("type", "button");
  eachButtonContainer.setAttribute("data-search", value);
  eachButtonContainer.setAttribute("class", "button-press");
  eachButtonContainer.setAttribute("class", "button-search");
  eachButtonContainer.textContent = value;
  eachButtonContainer.addEventListener("click", function pressOldButtons() {
    getGeo(value);
  });
  recentDiv.append(eachButtonContainer);
}

// Make a function to call from local storage and display on screen.
function renderHistory(value) {
  for (let i = 0; i <= 5; i++) {
    let eachButtonContainer = document.createElement("button");
    eachButtonContainer.setAttribute("type", "button");
    eachButtonContainer.setAttribute("data-search", value[i]);
    eachButtonContainer.setAttribute("class", "button-press");
    eachButtonContainer.setAttribute("class", "button-search");
    eachButtonContainer.textContent = value[i];
    eachButtonContainer.addEventListener("click", function pressOldButtons() {
      let newSearch = value[i];
      getGeo(newSearch);
    });
    previousDiv.append(eachButtonContainer);
  }
}

// Change the name of the city to Geocoding and make sure to return invalid if user inputs a city that doesn't match to anything.
function getGeo(cityName) {
  eachDay.innerHTML = ``;
  let text = city.value;
  if(text){
    cityName = text;
  } else {
    cityName = cityName;
  }
  cityLocation.innerHTML = cityName;
  store(cityName);
  let key = "010cc554e8087064e8910c4a2aa44a43";
  let limit = 1;

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

// Grabs the current weather forecast
function fetchWeather(lon, lat) {
  //use the values from city to fetch the weather
  let key = "010cc554e8087064e8910c4a2aa44a43";
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
      return response.json();
    })
    .then((data) => {
      let cityAttributes = {
        temp: data.current.temp,
        wind: data.current.wind_speed,
        humidity: data.current.humidity,
        clouds: data.current.clouds,
      };
      showWeather(cityAttributes);
    })
    .catch(console.err);
}

// Create a five day forecast function.
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
        let dateFormat =
          changeFormat.getMonth() +
          " / " +
          changeFormat.getDate() +
          " / " +
          changeFormat.getFullYear();
        let fiveDayObj = {
          tempMin: dayData.main.temp_min,
          tempMax: dayData.main.temp_max,
          humidityDaily: dayData.main.humidity,
          icon: dayData.weather[0].icon,
          currentCondition: dayData.weather[0].main,
          date: dateFormat,
        };
        console.log(fiveDayObj, "date check");

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
        city.value = '';
      }
    })
    .catch(console.err);
}

// Shows the weather on the screen.
function showWeather(attr) {
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

// Add event listener to search button.
searchButton.addEventListener("click", getGeo);

showPreviousSearch();