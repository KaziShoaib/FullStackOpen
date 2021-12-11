import React from "react"

const Filter = ({filterText, setFilterText}) => {
  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value)
  }

  return (
    <div>
      filter shown with : <input value={filterText} onChange={handleFilterTextChange}/>
    </div>
  )
}

export default Filter