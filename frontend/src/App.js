import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanetCard from './components/PlanetCard';
import CelestialBodyForm from './components/CelestialBodyForm';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [planets, setPlanets] = useState([]);
  const [filteredPlanets, setFilteredPlanets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPlanets();
  }, []);

  const fetchPlanets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/planets`);
      const sortedPlanets = response.data.data.sort((a, b) => a.id - b.id);
      setPlanets(sortedPlanets);
      setFilteredPlanets(sortedPlanets);
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

  const handleFormSubmit = async (formData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/planets`, formData);
      
      // Agregar nuevo planeta a la lista
      const newPlanets = [...planets, response.data.data].sort((a, b) => a.id - b.id);
      setPlanets(newPlanets);
      setFilteredPlanets(newPlanets);
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`✅ ${response.data.data.name} created successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Cerrar formulario
      setShowForm(false);
    } catch (err) {
      if (err.response?.data?.details) {
        setError('Validation Error: ' + err.response.data.details.join(', '));
      } else {
        setError('Error creating celestial body. Please try again.');
      }
      console.error('Error:', err);
    }
  };

  const handleDeletePlanet = async (planetId) => {
    try {
      await axios.delete(`${API_BASE_URL}/planets/${planetId}`);
      const newPlanets = planets.filter(p => p.id !== planetId);
      setPlanets(newPlanets);
      setFilteredPlanets(newPlanets.filter(p => {
        if (filter === 'all') return true;
        return p.type === filter;
      }));
      setSuccessMessage('✅ Celestial body deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error deleting celestial body');
      console.error('Error:', err);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🌌 Astronomy Explorer</h1>
        <p className="subtitle">Discover and create planets in our Solar System</p>
      </header>

      <div className="container">
        {error && (
          <div className="error">
            ❌ {error}
            <button onClick={() => setError(null)} className="close-btn">✕</button>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <div className="controls">
          <button 
            onClick={() => handleFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All Celestial Bodies
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
          <button 
            onClick={() => handleFilter('Dwarf Planet')}
            className={filter === 'Dwarf Planet' ? 'active' : ''}
          >
            Dwarf Planets
          </button>
          <button onClick={fetchPlanets}>
            🔄 Refresh
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="create-btn"
          >
            ➕ Create New
          </button>
        </div>
        

        {showForm && (
          <div className="form-container">
            <CelestialBodyForm 
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="loading">Loading celestial bodies...</div>
        ) : (
          <div className="planets-grid">
            {filteredPlanets.length > 0 ? (
              filteredPlanets.map(planet => (
                <PlanetCard 
                  key={planet.id} 
                  planet={planet}
                  onDelete={handleDeletePlanet}
                />
              ))
            ) : (
              <div className="no-results">No celestial bodies found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;