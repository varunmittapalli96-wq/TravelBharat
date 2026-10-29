import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('States API Endpoints', () => {
  it('GET /api/v1/states should return 36 states and union territories', async () => {
    const res = await request(app).get('/api/v1/states');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(36);
  });

  it('GET /api/v1/states with region filter should filter correctly', async () => {
    const res = await request(app).get('/api/v1/states?region=NORTH');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((s: any) => s.region === 'NORTH')).toBe(true);
  });

  it('GET /api/v1/states/:slug should return a single state with cities and placeCount', async () => {
    const res = await request(app).get('/api/v1/states/rajasthan');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Rajasthan');
    expect(res.body.data.capital).toBe('Jaipur');
    expect(Array.isArray(res.body.data.cities)).toBe(true);
  });

  it('GET /api/v1/states/unknown-slug should return 404', async () => {
    const res = await request(app).get('/api/v1/states/non-existent-state-12345');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
