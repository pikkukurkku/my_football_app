import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'



function App() {

  const [teams, setTeams] = useState([]);
  const [cities, setCities] = useState([]);
  const [matches, setMatches] = useState([]);
  const [randomMatch, setRandomMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCities, setShowCities] = useState(false); 
  const [showTeams, setShowTeams] = useState(false); 
  const [showRandomMatch, setShowRandomMatch] = useState(false); 
  


function getTeams() {
  axios
  .get('https://data.tipp.page/json_export/data.json')
    .then((response) => {
      const data = response.data;
      const teamsArray = Object.values(data.teams);
      setTeams(teamsArray);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      setError('Error fetching data. Please try again later.')
      setLoading(false)
    });
}


function getCities() {
  axios.get('https://data.tipp.page/json_export/data.json')
    .then((response) => {
      const data = response.data;
      const cities = new Set();

      for (const groupId in data.groups) {
        const group = data.groups[groupId];
        for (const matchId in group.matches) {
          const match = group.matches[matchId];
          if (match.city) {
            cities.add(match.city);
          }
        }
      }

      const citiesArray = Array.from(cities)
      setCities(citiesArray);   
      setLoading(false);     
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
}


function getMatches() {
  axios
  .get('https://data.tipp.page/json_export/data.json')
  .then((response) => {
    const data = response.data;
    const allMatches = [];

    for (const groupId in data.groups) {
      const group = data.groups[groupId];
      for (const matchId in group.matches) {
        const match = group.matches[matchId];
        if (match.teamId1 && match.teamId2 && match.results.final.pointsTeam1 !== undefined && match.results.final.pointsTeam2 !== undefined) {
          allMatches.push({
            id: matchId,
            team1: data.teams[match.teamId1]?.teamName || 'Unknown Team',
            team2: data.teams[match.teamId2]?.teamName || 'Unknown Team',
            score1: match.results.final.pointsTeam1,
            score2: match.results.final.pointsTeam2
          });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * allMatches.length);
    const randomMatch = allMatches[randomIndex];
    console.log('All Matches:', allMatches);
    console.log('Random match:', randomMatch);
    setRandomMatch(randomMatch);
    setMatches(allMatches);
    setLoading(false);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
    setLoading(false);
  });
}

function toggleCities() {
  if (!showCities && cities.length === 0) {
    getCities();
  }
  setShowCities(!showCities);
}

function toggleTeams() {
  if (!showTeams && teams.length === 0) {
    getTeams();
  }
  setShowTeams(!showTeams);
}

function getRandomMatch() {
  if (!showRandomMatch && allMatches.length === 0) {
    getMatches();
  }
  setShowRandomMatch(!showRandomMatch);
}

//   useEffect(() => {
//   getTeams()
// }, []);

// useEffect(() => {
//   getCities()
// }, []);

useEffect(() => {
getMatches()
}, []);

if (loading) {
  return <div>Loading...</div>;
}

  if (error) {
    return <div>{error}</div>
  }


  return (
    <>
        <div className="main">
        <h1><img src="./ball2.png" alt="ball"></img>  UEFA euro 2024 stats  <img src="./ball2.png" alt="ball"></img></h1>
        <div className="submain">
        <section>
        <button onClick={toggleTeams} className="button">Teams participating: (click to {showTeams? 'hide' : 'view'})</button>
        {showTeams && (
        <div className="teams">
        {Array.isArray(teams) && teams.map((t, index) => (
              <div key={index}className="oneTeam">
                <p>{t.teamName}</p>
                <div className="short">
                <p>{t.teamShort}</p>
                </div>
                </div>
        ))}
        </div>
        )}
        </section>


        <section>
          <button onClick={toggleCities} className="button">Host cities (click to {showCities ? 'hide' : 'view'}):</button>
          {showCities && (
  <div className="cities">
    {Array.isArray(cities) &&
      cities.map((c, index) => (
        <div key={index}>
          <p>{c}</p>
        </div>
      ))}
       </div>
          )}
      </section>
       


        <section>
        <button onClick={getMatches} className="button">Random match score:</button>
   <div className="matches">
              {randomMatch ? (
                <div>
                  <p>{randomMatch.team1} vs {randomMatch.team2}</p>
                  <p>Score: {randomMatch.score1} - {randomMatch.score2}</p>
                </div>
              ) : (
                <p>No match data available.</p>
              )}
            </div>
        </section> 
        </div>
        </div>   
    </>                                                   
  );
}
                   
export default App
