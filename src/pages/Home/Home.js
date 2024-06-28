// src/pages/Home/Home.js

import React, { useState, useEffect } from 'react';
import './Home.css';
import Hour from '../../components/Hour/Hour';
import NextDay from '../../components/NextDay/NextDay';
import translations from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faTint, faTachometerAlt, faCloudRain, faTemperatureHigh, faSun, faMoon, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { getCities, addCity, CITY_KEY } from '../../cityStorage';

const Home = ({ onCitySelect }) => {
  const [cityInput, setCityInput] = useState('');
  const [cityButtons, setCityButtons] = useState(getCities());
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const language = navigator.language.split('-')[0] || 'en';
  const labels = translations[language] || translations.en;
  const apiKey = 'e4988f4b62be67e1117216697e2d0c74';

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const updateWeatherInterval = setInterval(() => {
        handleCityClick(selectedCity);
      }, 60000);
      return () => clearInterval(updateWeatherInterval);
    }
  }, [selectedCity]);

  const handleInputChange = (event) => setCityInput(event.target.value);

  const handleAddCity = () => {
    if (cityInput.trim()) {
      addCity(cityInput.trim());
      setCityButtons(getCities());
      setCityInput('');
    }
  };

  const handleReset = () => {
    localStorage.removeItem(CITY_KEY);
    setCityButtons([]);
    setWeatherInfo(null);
    setSelectedCity('');
    onCitySelect('', null);
  };

  const getUVIndex = async (lat, lon) => {
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    try {
      const response = await fetch(uvUrl);
      if (response.ok) {
        const uvData = await response.json();
        return uvData.value;
      }
      console.error('Error fetching UV data:', response.statusText);
      return null;
    } catch (error) {
      console.error('Error fetching UV data:', error);
      return null;
    }
  };

  const handleCityClick = async (city) => {
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    try {
      const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric&lang=${language}`);
      if (response.ok) {
        const weatherData = await response.json();
        const uvIndex = await getUVIndex(weatherData.coord.lat, weatherData.coord.lon);
        setWeatherInfo({ ...weatherData, uvIndex });
        setSelectedCity(city);
        onCitySelect(city, { ...weatherData, uvIndex });
      } else {
        alert('City not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const isDayTime = () => {
    if (!weatherInfo || !weatherInfo.sys) return false;
    const now = new Date();
    const sunrise = new Date(weatherInfo.sys.sunrise * 1000);
    const sunset = new Date(weatherInfo.sys.sunset * 1000);
    return now >= sunrise && now < sunset;
  };

  return (
    <section className="container">
      <h1 style={{ color: '#fff' }}>Weather Wise</h1>
      <div className="search-container">
        <input
          type="text"
          value={cityInput}
          onChange={handleInputChange}
          placeholder={labels.enterCityName}
          id="city-input"
        />
        <button id="add-city-btn" onClick={handleAddCity}>{labels.add}</button>
        <button id="reset-btn" onClick={handleReset}>X</button>
      </div>
      <div id="city-buttons">
        {cityButtons.map((city, index) => (
          <button className="city-button" key={index} onClick={() => handleCityClick(city)}>{city}</button>
        ))}
      </div>
      {weatherInfo && (
        <div id="weather-info" className="weather-card">
          <h3 id="city-name">{weatherInfo.name}</h3>
          <p id="date">{currentTime}</p>
          <img
            id="weather-icon"
            src={`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`}
            alt="Weather Icon"
          />
          <p id="temperature">{weatherInfo.main.temp}°C</p>
          <p id="description">{weatherInfo.weather[0].description}</p>
          <div className="weather-details">
            <p id="wind-speed">
              <span>{labels.wind} </span>
              <FontAwesomeIcon icon={faWind} />
              <br />
              {weatherInfo.wind.speed} m/s
            </p>
            <p id="humidity">
              <span>{labels.humidity} </span>
              <FontAwesomeIcon icon={faTint} />
              <br />
              {weatherInfo.main.humidity} %
            </p>
            <p id="pressure">
              <span>{labels.pressure} </span>
              <FontAwesomeIcon icon={faTachometerAlt} />
              <br />
              {weatherInfo.main.pressure} hPa
            </p>
            <p id="rain">
              <span>{labels.rain} </span>
              <FontAwesomeIcon icon={faCloudRain} />
              <br />
              {weatherInfo.rain ? `${weatherInfo.rain['1h']} mm` : '0 mm'}
            </p>
            <p id="real-feel">
              <span>{labels.realFeel} </span>
              <FontAwesomeIcon icon={faTemperatureHigh} />
              <br />
              {weatherInfo.main.feels_like} °C
            </p>
            {isDayTime() && (
              <p id="uv-index">
                <span>{labels.uvIndex} </span>
                <FontAwesomeIcon icon={faLightbulb} />
                <br />
                {weatherInfo.uvIndex !== undefined ? weatherInfo.uvIndex : 'N/A'}
              </p>
            )}
            <p id="sunrise">
              <span>{labels.sunrise} </span>
              <FontAwesomeIcon icon={faSun} />
              <br />
              {new Date(weatherInfo.sys.sunrise * 1000).toLocaleTimeString()}
            </p>
            <p id="sunset">
              <span>{labels.sunset} </span>
              <FontAwesomeIcon icon={faMoon} />
              <br />
              {new Date(weatherInfo.sys.sunset * 1000).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
      <section>
        <Hour city={selectedCity} />
        <NextDay city={selectedCity} />
      </section>
    </section>
  );
};

export default Home;
