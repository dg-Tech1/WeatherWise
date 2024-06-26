// src/App.js

import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Background from './components/Background/Background';

function App() {
  const [selectedCity, setSelectedCity] = useState('');
  const [weather, setWeather] = useState(null);

  const handleCitySelect = (city, weatherData) => {
    setSelectedCity(city);
    if (weatherData) {
      setWeather(weatherData.weather);
    } else {
      setWeather(null);
    }
  };

  return (
    <div className="App">
      <Background weather={weather} />
      <header className="App-header">
        <h1>Live Weather</h1>
      </header>
      <main>
        <Home onCitySelect={handleCitySelect} />
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;

