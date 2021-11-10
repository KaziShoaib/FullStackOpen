import React, {useState, useEffect} from "react"
import axios from "axios" 

import CountryList from "./CountryList"
import Country from "./Country"

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(()=>{
    axios
      .get("https://restcountries.com/v2/all")
      .then(response => setCountries(response.data))
  }, [])

  const countriesToShow = countries.filter(country => country.name.toLowerCase().includes(searchText.toLowerCase()))

  const handleSearchTextChange = (event) => setSearchText(event.target.value)  

  return (
    <div>
      <label>Find Countries</label>
      <input value={searchText} onChange= {handleSearchTextChange}/>
      { countriesToShow.length > 10 ? 
        (<p>Too many matches, specify another filter</p>) :
        ( countriesToShow.length === 1 ? 
          (<Country country={countriesToShow[0]}/>) : 
          ( countriesToShow.length === 0 ? 
            <p>No match found</p> :
            <CountryList 
              countriesToShow={countriesToShow} 
              setSearchText={setSearchText}
            />   
          )
        )
      }

    </div>
  )
}

export default App;
