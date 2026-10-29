import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Admin Authentication API', () => {
  it('POST /api/v1/admin/auth/login with valid credentials should succeed and return cookie', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@travelbharat.in',
        password: 'Admin@TravelBharat2024!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('admin@travelbharat.in');
    expect(res.body.data.role).toBe('ADMIN');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('POST /api/v1/admin/auth/login with invalid password should fail with 401', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@travelbharat.in',
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/dashboard without auth should return 401', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
