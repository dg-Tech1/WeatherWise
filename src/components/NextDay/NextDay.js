// src/components/NextDay/NextDay.js

import React, { useEffect, useState } from 'react';
import './NextDay.css';
import translations from '../../translations';

const NextDay = ({ city }) => {
  const [forecastData, setForecastData] = useState([]);
  const language = navigator.language.split('-')[0] || 'en';
  const labels = translations[language] || translations.en;

  useEffect(() => {
    const fetchForecastData = async () => {
      const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast';
      const apiKey = 'e4988f4b62be67e1117216697e2d0c74';

      try {
        const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric&lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          setForecastData(data.list.filter((_, index) => index % 8 === 0).slice(0, 5)); // 5-day forecast, 1 forecast per day
        } else {
          alert('City not found. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    if (city) {
      fetchForecastData();
    } else {
      setForecastData([]); // Clear forecast data if no city is selected
    }
  }, [city, language]);

  return (
    <div className="conteneur">
      {forecastData.map((data, index) => (
        <div key={index} className="carte">
          <p>{new Date(data.dt * 1000).toLocaleDateString()}</p>
          <p>{data.main.temp}°C</p>
          <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="Weather Icon" />
          <p>{data.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
};

export default NextDay;

