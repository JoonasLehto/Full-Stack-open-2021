import axios from 'axios'
import React, { useState, useEffect } from 'react'

const weather_api_key = process.env.REACT_APP_WEATHER_API_KEY

const Filter = ({ options }) => {
  return (
    <div>
      filter countries<input
        value={options.value}
        onChange={options.onChange}
        />
    </div>
  )
}

const Button = ({ text, method }) => {
  return (
    <button onClick={method}>{text}</button>
  )
}

const Weather = ({ country }) => {

  const [weatherInfo, setWeatherInfo] = useState({
    temperature: 0,
    wind: {
      speed: 0,
      direction: 0
    },
    cloudiness: 0,
    loaded: false
  })
  
  useEffect(() => {
    setWeatherInfo({
      temperature: 0,
      wind: {
        speed: 0,
        direction: 0
      },
      cloudiness: 0,
      loaded: false
    })
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${weather_api_key}`)
      .then(response => {
        const newValue = {
          temperature: response.data.main.temp,
          wind: {
            speed: response.data.wind.speed,
            direction: response.data.wind.deg
          },
          cloudiness: response.data.clouds.all,
          loaded: true
        }
        setWeatherInfo(newValue)
      })
  }, [country.capital])
  
  if (weatherInfo.loaded === true) {
    return (
      <div>
        <h3>{`Weather in ${country.capital}`}</h3>
        <p>{`Temperature: ${weatherInfo.temperature} Kelvin`}</p>
        <p>{`Wind: ${weatherInfo.wind.speed} m/s, Direction: ${weatherInfo.wind.direction} degrees`}</p>
        <p>{`Cloudiness: ${weatherInfo.cloudiness} percentage`}</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>Weather info not loaded</p>
      </div>
    )
  }
}

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>{`Capital: ${country.capital}`}</p>
      <p>{`Population: ${country.population}`}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => (
          <li key={language.iso639_2}>{language.name}</li>
        ))}
      </ul>
      <picture>
        <img src={country.flag} alt={`Flag of ${country.name}`} style={{ width: "auto", maxWidth: "200px" }} />
      </picture>
      <Weather country={country}></Weather>
    </div>
  )
}

const Countries = ({ countries, changeFilter }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.alpha3Code}>
          <span>{`${country.name}`}</span>
          <Button text="show" method={() => changeFilter(country.name)} />
        </div>
      ))}
    </div>
  )
}

const Content = ({ options }) => {
  if (options.countries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  } else if (options.countries.length === 1) {
    return (
      <div>
        <Country country={options.countries[0]} />
      </div>
    )
  } else {
    return (
      <Countries countries={options.countries} changeFilter={options.changeFilter} />
    )
  }
}

function App() {

  const [countries, setCountries] = useState([])
  const [ filter, setFilter ] = useState('')

  const handleChange = updateMethod => event => {
    updateMethod(event.target.value)
  }

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filterOptions = {
    value: filter,
    onChange: handleChange(setFilter)
  }

  const filteredCountries = countries.filter(country => {
    return country.name.toLowerCase().includes(filter.toLowerCase())
  })

  const contentOptions = {
    countries: filteredCountries,
    changeFilter: setFilter
  }

  return (
    <div>
      <Filter options={filterOptions} />
      <Content options={contentOptions} />
    </div>
  );
}

export default App;
