const request = require('supertest');
const app = require('./server');

describe('Astronomy API Tests', () => {
  
  describe('Health Check', () => {
    test('GET /health should return OK status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  describe('GET /api/planets', () => {
    test('should return all planets', async () => {
      const res = await request(app).get('/api/planets');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    test('should have correct planet structure', async () => {
      const res = await request(app).get('/api/planets');
      const planet = res.body.data[0];
      expect(planet).toHaveProperty('id');
      expect(planet).toHaveProperty('name');
      expect(planet).toHaveProperty('diameter');
      expect(planet).toHaveProperty('distance');
      expect(planet).toHaveProperty('moons');
      expect(planet).toHaveProperty('type');
      expect(planet).toHaveProperty('createdAt');
    });
  });

  describe('GET /api/planets/:id', () => {
    test('should return planet by valid ID', async () => {
      const res = await request(app).get('/api/planets/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(1);
      expect(res.body.data.name).toBe('Mercury');
    });

    test('should return 404 for invalid planet ID', async () => {
      const res = await request(app).get('/api/planets/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/planets/name/:name', () => {
    test('should return planet by name (case-insensitive)', async () => {
      const res = await request(app).get('/api/planets/name/earth');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Earth');
    });

    test('should return 404 for non-existent planet', async () => {
      const res = await request(app).get('/api/planets/name/Krypton');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/planets/type/:type', () => {
    test('should return planets by type', async () => {
      const res = await request(app).get('/api/planets/type/Terrestrial');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    test('should return empty array for unknown type', async () => {
      const res = await request(app).get('/api/planets/type/Unknown');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
    });
  });

  describe('POST /api/planets - Create Celestial Body', () => {
    test('should create a new celestial body successfully', async () => {
      const newPlanet = {
        name: 'Uranus',
        type: 'Gas Giant',
        diameter: 50724,
        distance: 2871.0,
        moons: 27
      };

      const res = await request(app)
        .post('/api/planets')
        .send(newPlanet);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Uranus');
      expect(res.body.data.type).toBe('Gas Giant');
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
    });

    test('should reject creation with missing name', async () => {
      const newPlanet = {
        type: 'Gas Giant',
        diameter: 50724,
        distance: 2871.0,
        moons: 27
      };

      const res = await request(app)
        .post('/api/planets')
        .send(newPlanet);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toContainEqual(
        expect.stringContaining('Name is required')
      );
    });

    test('should reject creation with invalid type', async () => {
      const newPlanet = {
        name: 'InvalidPlanet',
        type: 'Invalid Type',
        diameter: 5000,
        distance: 1000.0,
        moons: 0
      };

      const res = await request(app)
        .post('/api/planets')
        .send(newPlanet);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toContainEqual(
        expect.stringContaining('Type must be one of')
      );
    });

    test('should reject creation with negative diameter', async () => {
      const newPlanet = {
        name: 'BadPlanet',
        type: 'Terrestrial',
        diameter: -100,
        distance: 1000.0,
        moons: 0
      };

      const res = await request(app)
        .post('/api/planets')
        .send(newPlanet);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toContainEqual(
        expect.stringContaining('Diameter must be a positive number')
      );
    });

    test('should reject creation with duplicate name', async () => {
      const newPlanet = {
        name: 'Mercury',
        type: 'Terrestrial',
        diameter: 3882,
        distance: 57.9,
        moons: 0
      };

      const res = await request(app)
        .post('/api/planets')
        .send(newPlanet);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toContainEqual(
        expect.stringContaining('already exists')
      );
    });
  });

  describe('PUT /api/planets/:id - Update Celestial Body', () => {
    test('should update a celestial body successfully', async () => {
      const updateData = {
        moons: 50
      };

      const res = await request(app)
        .put('/api/planets/1')
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.moons).toBe(50);
      expect(res.body.data.name).toBe('Mercury');
    });

    test('should return 404 when updating non-existent planet', async () => {
      const updateData = {
        moons: 10
      };

      const res = await request(app)
        .put('/api/planets/999')
        .send(updateData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    test('should validate update data', async () => {
      const updateData = {
        diameter: -100
      };

      const res = await request(app)
        .put('/api/planets/1')
        .send(updateData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/planets/:id - Delete Celestial Body', () => {
    test('should delete a celestial body successfully', async () => {
      // First create a planet to delete
      const newPlanet = {
        name: 'Neptune',
        type: 'Gas Giant',
        diameter: 49244,
        distance: 4495.0,
        moons: 14
      };

      const createRes = await request(app)
        .post('/api/planets')
        .send(newPlanet);

      const planetId = createRes.body.data.id;

      // Then delete it
      const deleteRes = await request(app)
        .delete(`/api/planets/${planetId}`);

      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.id).toBe(planetId);
    });

    test('should return 404 when deleting non-existent planet', async () => {
      const res = await request(app)
        .delete('/api/planets/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('404 Handling', () => {
    test('should return 404 for non-existent endpoint', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});