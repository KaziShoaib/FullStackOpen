import React from "react"

const CountryList = ({countriesToShow, setSearchText}) => {
  return (
    <div>
      {countriesToShow.map(country => 
          <li key={country.name}>
            {country.name} 
            <button onClick={() => setSearchText(country.name)}>
              show
            </button>
          </li> 
        )
      }
    </div>
  )
}

export default CountryList