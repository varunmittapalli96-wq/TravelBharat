import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Places API Endpoints', () => {
  it('GET /api/v1/places should return paginated places', async () => {
    const res = await request(app).get('/api/v1/places?limit=10&page=1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.total).toBeGreaterThan(0);
  });

  it('GET /api/v1/places/:slug should return place details with images and nearby places', async () => {
    const res = await request(app).get('/api/v1/places/taj-mahal-agra');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Taj Mahal');
    expect(res.body.data.category).toBe('HERITAGE');
    expect(res.body.data.isUnesco).toBe(true);
    expect(Array.isArray(res.body.data.images)).toBe(true);
  });

  it('GET /api/v1/places with unesco filter should return only UNESCO sites', async () => {
    const res = await request(app).get('/api/v1/places?unesco=true');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.every((p: any) => p.isUnesco === true)).toBe(true);
  });
});
