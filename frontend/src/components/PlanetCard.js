import React from 'react';
import './PlanetCard.css';

function PlanetCard({ planet }) {
  return (
    <div className="planet-card">
      <h2>{planet.name}</h2>
      <span className="type-badge">{planet.type}</span>
      
      <div className="planet-info">
        <div className="info-item">
          <div className="info-label">Diameter (km)</div>
          <div className="info-value">{planet.diameter.toLocaleString()}</div>
        </div>
        
        <div className="info-item">
          <div className="info-label">Distance from Sun (M km)</div>
          <div className="info-value">{planet.distance}</div>
        </div>
        
        <div className="info-item">
          <div className="info-label">Moons</div>
          <div className="info-value">{planet.moons}</div>
        </div>
        
        <div className="info-item">
          <div className="info-label">ID</div>
          <div className="info-value">#{planet.id}</div>
        </div>
      </div>
    </div>
  );
}

export default PlanetCard;