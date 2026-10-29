import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Search & Public Utility API', () => {
  it('GET /api/v1/search/suggest?q=raj should return suggestions for states, cities, places', async () => {
    const res = await request(app).get('/api/v1/search/suggest?q=raj');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/stats should return counts for states, cities, places, unesco', async () => {
    const res = await request(app).get('/api/v1/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stateCount).toBe(36);
    expect(res.body.data.cityCount).toBe(81);
    expect(res.body.data.placeCount).toBeGreaterThan(0);
  });

  it('POST /api/v1/contact with valid payload should store contact message', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'Ananya Sharma',
        email: 'ananya@example.com',
        subject: 'General Tourism Inquiry',
        message: 'Could you please suggest best historical places in Rajasthan for a 5-day tour?',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/analytics/event should record analytics event', async () => {
    const res = await request(app)
      .post('/api/v1/analytics/event')
      .send({
        event: 'PAGE_VIEW',
        page: '/states/rajasthan',
        data: { referrer: 'direct' },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
