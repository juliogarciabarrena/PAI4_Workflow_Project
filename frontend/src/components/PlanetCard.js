import React, { useState } from 'react';
import './PlanetCard.css';

function PlanetCard({ planet, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(planet.id);
    }
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="planet-card">
      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete <strong>{planet.name}</strong>?</p>
          <div className="confirmation-buttons">
            <button className="btn-confirm" onClick={handleDelete}>
              ✓ Delete
            </button>
            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card-header">
        <h2>{planet.name}</h2>
        <button 
          className="delete-btn"
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete this celestial body"
        >
          🗑️
        </button>
      </div>

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

      {planet.createdAt && (
        <div className="created-at">
          Created: {formatDate(planet.createdAt)}
        </div>
      )}
    </div>
  );
}

export default PlanetCard;