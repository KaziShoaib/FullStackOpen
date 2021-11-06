import React, {useState} from "react";

const Heading = ({text}) => {
  return (
    <h2>{text}</h2>
  )
}

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
   <tr>
     <td>{text}</td>
     <td>{value}</td>
   </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  if(total === 0)
    return (
      <p>No feedback given</p>
    )
  return (
    <table>      
      <tbody>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />
        <StatisticLine text={"all"} value={total} />
        <StatisticLine text={"average"} value={(good - bad)/ total} />
        <StatisticLine text={"positive"} value={(good / total * 100) + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleBadClick = () => setBad(bad + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)

  return (
    <div>
      <Heading text = {"give feedback"}/>
      <Button text={"good"} handleClick={handleGoodClick} />
      <Button text={"neutral"} handleClick={handleNeutralClick} />
      <Button text={"bad"} handleClick={handleBadClick} />      
      <Heading text = {"Statistics"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>    
  );
}

export default App;
