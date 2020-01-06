window.addEventListener('load', ()=>{
  let long;
  let lat;
  let temperatureDescription = document.querySelector('.temperature-description');
  let temperatureDegree = document.querySelector('.temperature-degree');
  let locationTimezone = document.querySelector('.location-timezone');
  let temperatureSection = document.querySelector('.temperature');
  const temperatureSpan = document.querySelector('.temperature span');

  mapboxgl.accessToken = 'pk.eyJ1IjoiZHJhZ29uZWUiLCJhIjoiY2s0bG85Y3o0MW5tczNtbGI4dDEwaHY5MSJ9.rUtBaPdsHb4FrhrJal5uHw';
  var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
  });


  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition
    (position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      let searchBtn = document.getElementById('submit');
      let search = document.querySelector('.searchBox input');
      let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=c459a75f33150b8d6c8ba11d8b3e53de`;
      getTemperature(api);



      searchBtn.addEventListener('click', ()=>{
        const api2 = `http://api.openweathermap.org/data/2.5/weather?q=${search.value}&appid=c459a75f33150b8d6c8ba11d8b3e53de`;
        getTemperature(api2);
        })

      map.on('click', function(e) {
            long = e.lngLat.lng;
            lat = e.lngLat.lat;
            console.log(long, lat);
            let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=c459a75f33150b8d6c8ba11d8b3e53de`;
            getTemperature(api);
        });

    });

  } else{
    h1.textContent = "Please allow geolocation";
  }

  function getTemperature(api){
    //const proxy = `https://cors-anywhere.herokuapp.com/`
    //const api = `${proxy}https://api.darksky.net/forecast/7de672037761b201641711bd37730eaf/${lat}, ${long}`;

    fetch(api)
      .then(data => {
        return data.json();
      })
      .then(data =>{
        const {temp} = data.main;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        // formula to change it to farenheit from kelvin
        let fahrenheit = Math.floor((temp-273.15)*9/7+32);
        // set DOM elements from the API
        temperatureDegree.textContent = fahrenheit;
        temperatureSpan.textContent = "F";
        temperatureDescription.textContent = description;
        const {country} = data.sys;
        locationTimezone.textContent = country+' / '+data.name;

        // formula for celcius from kelvin
        let celcius = Math.floor(temp-273.15);
        setIcons(icon, document.querySelector('.icon'));

        // change temperature to celcius/farenheit
        temperatureSection.addEventListener('click', ()=>{
          if(temperatureSpan.textContent === "F"){
            temperatureSpan.textContent = "C";
            temperatureDegree.textContent = celcius;
          } else {
            temperatureSpan.textContent ="F";
            temperatureDegree.textContent = fahrenheit;
          }
        })
      });
  };

  function setIcons(icon, iconId){
    const skycons = new Skycons({color: "white"});
    if (icon === "01d")
      currentIcon = "CLEAR_DAY";
    else if (icon === "01n")
      currentIcon = "CLEAR_NIGHT";
    else if (icon === "02d")
      currentIcon = "PARTLY_CLOUDY_DAY";
    else if (icon === "02n")
      currentIcon = "PARTLY_CLOUDY_NIGHT";
    else if (icon === "03d" || icon === "03n")
      currentIcon = "CLOUDY";
    else if (icon === "04d" || icon === "04n")
      currentIcon = "WIND"
    else if (icon === "09d" || icon === "09n" || icon === "10d" || icon === "10n" ||
    icon === "11n" || icon === "11d")
      currentIcon = "RAIN";
    else if (icon === "13d" || icon === "13n")
      currentIcon = "SNOW";
    else if (icon === "50d" || icon === "50n")
      currentIcon = "MIST";
    else
      currentIcon = "SLEET";
    //const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconId, Skycons[currentIcon]);
  }
});
