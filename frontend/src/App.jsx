import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import './App.css'

function App() {
  console.log("App is rendering")
  const { loading, error, data } = useQuery(GET_TEAMS)

  if (loading) return <p>Loading teams...</p>
  if (error) return <p>Error: {error.message}</p>
  return (
    <div>
      <h1>Champions League Predictor</h1>
      <h2>Available Teams</h2>
      {data.getTeams.map((team) => <p key={team}>{team}</p>)}
      <p>Predict the outcome of your favorite Champion League matches</p>
    </div>
  )
}

const GET_TEAMS = gql`
  query{
  getTeams
}`

export default App
