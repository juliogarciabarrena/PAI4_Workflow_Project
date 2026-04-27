const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data: Planets information (mutable for CRUD operations)
let planets = [
  {
    id: 1,
    name: 'Mercury',
    diameter: 3882,
    distance: 57.9,
    moons: 0,
    type: 'Terrestrial',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Venus',
    diameter: 12104,
    distance: 108.2,
    moons: 0,
    type: 'Terrestrial',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 3,
    name: 'Earth',
    diameter: 12742,
    distance: 149.6,
    moons: 1,
    type: 'Terrestrial',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 4,
    name: 'Mars',
    diameter: 6779,
    distance: 227.9,
    moons: 2,
    type: 'Terrestrial',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 5,
    name: 'Jupiter',
    diameter: 139820,
    distance: 778.5,
    moons: 95,
    type: 'Gas Giant',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 6,
    name: 'Saturn',
    diameter: 116460,
    distance: 1434.0,
    moons: 146,
    type: 'Gas Giant',
    createdAt: new Date('2024-01-01')
  }
];

// Helper function to get next ID
const getNextId = () => {
  return Math.max(...planets.map(p => p.id), 0) + 1;
};

// Input validation helper
const validateCelestialBody = (body, currentId = null) => {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!body.type || !['Terrestrial', 'Gas Giant', 'Dwarf Planet', 'Star', 'Comet', 'Asteroid'].includes(body.type)) {
    errors.push('Type must be one of: Terrestrial, Gas Giant, Dwarf Planet, Star, Comet, Asteroid');
  }

  if (typeof body.diameter !== 'number' || body.diameter <= 0) {
    errors.push('Diameter must be a positive number');
  }

  if (typeof body.distance !== 'number' || body.distance < 0) {
    errors.push('Distance must be a non-negative number');
  }

  if (typeof body.moons !== 'number' || body.moons < 0) {
    errors.push('Moons must be a non-negative number');
  }

  if (
    planets.some(
      p =>
        p.name.toLowerCase() === body.name?.toLowerCase() &&
        p.id !== currentId
    )
  ) {
    errors.push('A celestial body with this name already exists');
  }

  return errors;
};

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

// CREATE: Add new celestial body
app.post('/api/planets', (req, res) => {
  try {
    const { name, type, diameter, distance, moons } = req.body;

    // Validate input
    const validationErrors = validateCelestialBody({
      name,
      type,
      diameter,
      distance,
      moons
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Create new planet
    const newPlanet = {
      id: getNextId(),
      name: name.trim(),
      type,
      diameter,
      distance,
      moons,
      createdAt: new Date()
    };

    // Add to array
    planets.push(newPlanet);

    res.status(201).json({
      success: true,
      message: 'Celestial body created successfully',
      data: newPlanet
    });
  } catch (error) {
    console.error('Error creating planet:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// UPDATE: Modify existing celestial body
app.put('/api/planets/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const planetIndex = planets.findIndex(p => p.id === id);

    if (planetIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Planet not found'
      });
    }

    const { name, type, diameter, distance, moons } = req.body;
    const currentPlanet = planets[planetIndex];

    // Prepare updated data
    const updatedData = {
      name: name !== undefined ? name : currentPlanet.name,
      type: type !== undefined ? type : currentPlanet.type,
      diameter: diameter !== undefined ? diameter : currentPlanet.diameter,
      distance: distance !== undefined ? distance : currentPlanet.distance,
      moons: moons !== undefined ? moons : currentPlanet.moons
    };

    // Validate updated data
    const validationErrors = validateCelestialBody(updatedData, currentPlanet.id);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Update planet
    planets[planetIndex] = {
      ...currentPlanet,
      ...updatedData,
      id: currentPlanet.id,
      createdAt: currentPlanet.createdAt,
      updatedAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Celestial body updated successfully',
      data: planets[planetIndex]
    });
  } catch (error) {
    console.error('Error updating planet:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE: Remove celestial body
app.delete('/api/planets/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const planetIndex = planets.findIndex(p => p.id === id);

    if (planetIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Planet not found'
      });
    }

    const deletedPlanet = planets[planetIndex];
    planets.splice(planetIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Celestial body deleted successfully',
      data: deletedPlanet
    });
  } catch (error) {
    console.error('Error deleting planet:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get planet by name - VULNERABLE A XSS REFLEJADO
app.get('/api/planets/name/:name', (req, res) => {
  try {
    const name = req.params.name; // ⚠️ Sin sanitizar
    const planet = planets.find(p => p.name.toLowerCase() === name.toLowerCase());
    
    if (!planet) {
      // ⚠️ VULNERABILIDAD: El input del usuario se refleja directamente en la respuesta HTML
      return res.status(404).send(`
        <html>
          <body>
            <h1>Planet not found: ${name}</h1>
            <p>No planet with the name "${name}" exists in our database.</p>
          </body>
        </html>
      `);
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server only when running directly, not when imported by tests
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Astronomy API server running on port ${PORT}`);
  });
}

module.exports = app;