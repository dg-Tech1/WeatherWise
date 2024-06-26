// cityStorage.js

// cityStorage.js

export const CITY_KEY = 'cities'; // Définissez CITY_KEY pour identifier la clé localStorage

export const getCities = () => {
  const cities = localStorage.getItem(CITY_KEY);
  return cities ? JSON.parse(cities) : [];
};

export const addCity = (cityName) => {
  const cities = getCities();
  if (!cities.includes(cityName)) {
    cities.push(cityName);
    localStorage.setItem(CITY_KEY, JSON.stringify(cities));
  }
};

export const removeCity = (cityName) => {
  let cities = getCities();
  cities = cities.filter((city) => city !== cityName);
  localStorage.setItem(CITY_KEY, JSON.stringify(cities));
};
