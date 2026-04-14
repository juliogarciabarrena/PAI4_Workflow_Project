const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data: Planets information
const planets = [
  {
    id: 1,
    name: 'Mercury',
    diameter: 3882,
    distance: 57.9,
    moons: 0,
    type: 'Terrestrial'
  },
  {
    id: 2,
    name: 'Venus',
    diameter: 12104,
    distance: 108.2,
    moons: 0,
    type: 'Terrestrial'
  },
  {
    id: 3,
    name: 'Earth',
    diameter: 12742,
    distance: 149.6,
    moons: 1,
    type: 'Terrestrial'
  },
  {
    id: 4,
    name: 'Mars',
    diameter: 6779,
    distance: 227.9,
    moons: 2,
    type: 'Terrestrial'
  },
  {
    id: 5,
    name: 'Jupiter',
    diameter: 139820,
    distance: 778.5,
    moons: 95,
    type: 'Gas Giant'
  },
  {
    id: 6,
    name: 'Saturn',
    diameter: 116460,
    distance: 1434.0,
    moons: 146,
    type: 'Gas Giant'
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Get all planets
app.get('/api/planets', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: planets.length,
      data: planets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get planet by ID
app.get('/api/planets/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const planet = planets.find(p => p.id === id);
    
    if (!planet) {
      return res.status(404).json({
        success: false,
        error: 'Planet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: planet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get planet by name
app.get('/api/planets/name/:name', (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const planet = planets.find(p => p.name.toLowerCase() === name);
    
    if (!planet) {
      return res.status(404).json({
        success: false,
        error: 'Planet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: planet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get planets by type
app.get('/api/planets/type/:type', (req, res) => {
  try {
    const type = req.params.type;
    const filteredPlanets = planets.filter(p => p.type === type);
    
    res.status(200).json({
      success: true,
      count: filteredPlanets.length,
      data: filteredPlanets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Astronomy API server running on port ${PORT}`);
});

module.exports = app;