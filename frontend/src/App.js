import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanetCard from './components/PlanetCard';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [planets, setPlanets] = useState([]);
  const [filteredPlanets, setFilteredPlanets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPlanets();
  }, []);

  const fetchPlanets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/planets`);
      setPlanets(response.data.data);
      setFilteredPlanets(response.data.data);
      setFilter('all');
    } catch (err) {
      setError('Error fetching planets. Make sure the API is running on port 3001.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (type) => {
    setFilter(type);
    if (type === 'all') {
      setFilteredPlanets(planets);
    } else {
      setFilteredPlanets(planets.filter(planet => planet.type === type));
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🌌 Astronomy Explorer</h1>
        <p className="subtitle">Discover planets in our Solar System</p>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div className="controls">
          <button 
            onClick={() => handleFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All Planets
          </button>
          <button 
            onClick={() => handleFilter('Terrestrial')}
            className={filter === 'Terrestrial' ? 'active' : ''}
          >
            Terrestrial
          </button>
          <button 
            onClick={() => handleFilter('Gas Giant')}
            className={filter === 'Gas Giant' ? 'active' : ''}
          >
            Gas Giants
          </button>
          <button onClick={fetchPlanets}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading planets...</div>
        ) : (
          <div className="planets-grid">
            {filteredPlanets.length > 0 ? (
              filteredPlanets.map(planet => (
                <PlanetCard key={planet.id} planet={planet} />
              ))
            ) : (
              <div className="no-results">No planets found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;