import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'
import './App.css'
import { useState } from 'react'


function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [predictedResult, setPredictedResult] = useState('')



  const { loading, error, data } = useQuery(GET_TEAMS)

  const [login, { loading: loginLoading, error: loginError }] = useMutation(LOGIN)
  const [register, { loading: registerLoading, error: registerError }] = useMutation(REGISTER)
  const [savePrediction, {
    loading: savingPrediction,
    error: saveError,
    refetch: refetchPredictions
  }] = useMutation(SAVE_PREDICTION);

  const [deletePrediction, {
    loading: deletingPrediction
  }] = useMutation(DELETE_PREDICTION);

  const {
    data: predictionData,
    loading: predictionsLoading,
    error: predictionsError
  } = useQuery(GET_USER_PREDICTIONS, {
    skip: !token,
    context: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    fetchPolicy: "network-only"
  });

  console.log("Saved predictions:", predictionData)

  if (loading) return <p>Loading teams...</p>
  if (error) return <p>Error: {error.message}</p>
  return (
    <div>
      <h1>Champions League Predictor</h1>
      <h2>Available Teams</h2>
      {data.getTeams.map((team) => <p key={team}>{team}</p>)}
      <p>Predict the outcome of your favorite Champion League matches</p>

      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type='email'
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        disabled={loginLoading}
        onClick={async () => {
          try {
            const result = await login({
              variables: {
                email: email,
                password: password
              }
            })

            if (result.data?.login) {
              setToken(result.data.login);
              console.log("Login successful!");
            }
          } catch (err) {
            console.error("Login failed:", err.message)
          }
        }}
      >
        {loginLoading ? 'Logging in...' : 'Login'}
      </button>

      {loginError && <p>{loginError.message}</p>}
      {token && <p>Logged in successfully!</p>}

      <button

        disabled={registerLoading}
        onClick={async () => {
          try {
            const result = await register({
              variables: {
                username,
                email,
                password
              }
            })

            console.log("Registration result:", result.data?.register)
          } catch (err) {
            console.error("Registration failed:", err.message)
          }
        }}
      >
        {registerLoading ? 'Registering...' : 'Register'}
      </button>

      {registerError && <p>{registerError.message}</p>}

      {token && (
        <div>
          <h2>Make a Prediction</h2>

          <label>Home Team</label>
          <select
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
          >
            <option value="">Select home team</option>
            {data.getTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <label>Away Team</label>
          <select
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
          >
            <option value="">Select away team</option>
            {data.getTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <label>Predicted Result</label>
          <select
            value={predictedResult}
            onChange={(e) => setPredictedResult(e.target.value)}
          >
            <option value="">Select result</option>
            <option value="Home Win">Home Win</option>
            <option value="Draw">Draw</option>
            <option value="Away Win">Away Win</option>
          </select>
        </div>
      )}

      #Save prediction button
      <button
        disabled={savingPrediction || !homeTeam || !awayTeam || !predictedResult}
        onClick={async () => {
          try {
            const result = await savePrediction({
              variables: {
                homeTeam,
                awayTeam,
                predictedResult
              },
              context: {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            });

            console.log("Prediction saved:", result.data?.savePrediction);

            await refetchPrediction;
            alert("Prediction saved successfully!");
          } catch (err) {
            console.error("Failed to save prediction:", err.message);
          }
        }}
      >
        {savingPrediction ? 'Saving...' : 'Save Prediction'}
      </button>

      {saveError && <p>{saveError.message}</p>}

      <h2>Prediction History</h2>

      {predictionsLoading && <p>Loading predictions...</p>}

      {predictionsError && (
        <p>Error: {predictionsError.message}</p>
      )}

      {predictionData?.getUserPrediction?.map((prediction) => (
        <div key={prediction.id}>
          <h3>{prediction.homeTeam} vs {prediction.awayTeam}</h3>
          <p>Your prediction: {prediction.predictedResult}</p>

          <button
            disabled={deletingPrediction}
            onClick={async () => {
              try {
                const result = await deletePrediction({
                  variables: {
                    id: prediction.id
                  },
                  context: {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                });

                if (result.data?.deletePrediction) {
                  await refetchPredictions();
                } else {
                  alert("Prediction could not be deleted.");
                }
              } catch (err) {
                console.error("Failed to delete prediction:", err.message);
              }
            }}
          >
            {deletingPrediction ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}

    </div>
  );
}

const LOGIN = gql`
    mutation Login($email: String!, $password: String!){
      login(email: $email, password: $password)
      }`

const GET_TEAMS = gql`
  query{
  getTeams
}`

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`
const SAVE_PREDICTION = gql`
  mutation SavePrediction(
    $homeTeam: String!
    $awayTeam: String!
    $predictedResult: String!
  ) {
    savePrediction(
      homeTeam: $homeTeam
      awayTeam: $awayTeam
      predictedResult: $predictedResult
    ) {
      id
      homeTeam
      awayTeam
      predictedResult
    }
  }
`;

const GET_USER_PREDICTIONS = gql`
  query {
    getUserPrediction {
      id
      homeTeam
      awayTeam
      predictedResult
      createdAt
    }
  }
`;

const DELETE_PREDICTION = gql`
  mutation DeletePrediction($id: ID!) {
    deletePrediction( id: $id)
    }
    `;

export default App
