import React, { useState, useEffect } from "react"
import axios from "axios"

const Country = ({country}) => {
  const [weatherData, setWeatherData] = useState({})
  
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
      .then(response => setWeatherData(response.data.current))
  }, [api_key, country.capital])  

  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language => 
          <li key={language.name}>{language.name}</li>)
        }        
      </ul>
      <img src={country.flag} alt="flag" width="200" height="150"/>
      <h3>Weather in {country.capital}</h3>
      {
        weatherData.temperature ? 
          <div>
            <p><b>temperature </b>{weatherData.temperature} celsius</p>
            <img 
              src={weatherData.weather_icons[0]} 
              alt="weather" width="100" height="50"
            />
            <p><b>wind: </b>{weatherData.wind_speed} mph direction <b>{weatherData.wind_dir}</b></p>
          </div>
          : ""
      }
      
    </div>
  )
}

export default Country