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

  describe('404 Handling', () => {
    test('should return 404 for non-existent endpoint', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});