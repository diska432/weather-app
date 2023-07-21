const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const apiKey = "c9eddba0131db9ef12bdcd69010d9154";
const locationButton = inputPart.querySelector('button');
let api;
const wIcon = wrapper.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");


inputField.addEventListener("keyup", (e) => {
    // e.preventDefault();
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
})

locationButton.addEventListener("click", () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api");
    }
})

function onSuccess(position){
    // console.log(position)
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error")
}

function requestApi(city) {
    // let cityApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    // let lat, lon;
    // await fetch(cityApi).then(response => response.json()).then(data => {
    //     lat = data[0].lat;
    //     lon = data[0].lon;
    // });
    // api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(data => weatherDetails(data));
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error")
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity,temp} = info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        } else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";
        } else if(id >= 800 && id <= 805){
            wIcon.src = "icons/cloud.svg";
        } else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        } else if(id >= 500 && id <= 532){
            wIcon.src = "icons/rain.svg";
        } else if(id >= 700 && id <= 782){
            wIcon.src = "icons/haze.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp + 0.5);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like + 0.5);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("error");
        wrapper.classList.add("active")
    }
    console.log(info);
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
    inputField.value = "";
})