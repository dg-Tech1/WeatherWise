// src/components/Background/Background.js

import React, { useEffect, useState } from 'react';
import './Background.css';

const weatherBackgrounds = {
  default: 'https://i.gifer.com/Lx0q.gif',
  'clear sky': 'https://i.gifer.com/Lx0q.gif',
  'few clouds': 'https://i.gifer.com/Lx0q.gif',
  'scattered clouds': 'https://i.gifer.com/7RtV.gif',
  'broken clouds': 'https://i.gifer.com/7RtV.gif',
  'shower rain': 'https://i.gifer.com/Ae6H.gif',
  rain: 'https://i.gifer.com/Ae6H.gif',
  thunderstorm: 'https://i.gifer.com/Rnim.gif',
  snow: 'https://i.gifer.com/2MZq.gif',
  mist: 'https://i.gifer.com/7RtV.gif',
};

const Background = ({ weather }) => {
  const [backgroundImage, setBackgroundImage] = useState(weatherBackgrounds.default);

  useEffect(() => {
    if (weather && weather[0] && weatherBackgrounds[weather[0].main.toLowerCase()]) {
      setBackgroundImage(weatherBackgrounds[weather[0].main.toLowerCase()]);
    } else {
      setBackgroundImage(weatherBackgrounds.default);
    }
  }, [weather]);

  return <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }} />;
};

export default Background;
