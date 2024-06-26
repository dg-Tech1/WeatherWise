// src/components/Hour/Hour.js

import React, { useEffect, useState } from 'react';
import './Hour.css';
import translations from '../../translations';

const Hour = ({ city }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const language = navigator.language.split('-')[0] || 'en';
  const labels = translations[language] || translations.en;

  useEffect(() => {
    const fetchHourlyData = async () => {
      const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast';
      const apiKey = 'e4988f4b62be67e1117216697e2d0c74';

      try {
        const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric&lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          setHourlyData(data.list); // Use all provided hourly data
        } else {
          alert('City not found. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching hourly weather data:', error);
      }
    };

    if (city) {
      fetchHourlyData();
    } else {
      setHourlyData([]); // Clear hourly data if no city is selected
    }
  }, [city, language]);

  return (
    <div className="containerp">
      {hourlyData.map((data, index) => (
        <div key={index} className="card">
          <p>{new Date(data.dt * 1000).toLocaleTimeString()}</p>
          <p>{data.main.temp}°C</p>
          <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="Weather Icon" />
          <p>{data.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
};

export default Hour;

