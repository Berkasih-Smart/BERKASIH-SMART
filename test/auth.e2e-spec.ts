import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SeedService } from '../src/database/seed.service';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    await app.get(SeedService).runSeed();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/login - valid credentials returns token and user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'hendra@berkasih.id',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('hendra@berkasih.id');
    expect(res.body.user.role).toBe('SUPER_ADMIN');
  });

  it('POST /api/auth/login - wrong password returns 401 Unauthorized', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'hendra@berkasih.id',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login - non-existent email returns 401 Unauthorized', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'unknown@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me - valid token returns current user profile', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'nurul@berkasih.id',
        password: 'password123',
      });

    const token = loginRes.body.token;

    const meRes = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('nurul@berkasih.id');
    expect(meRes.body.user.role).toBe('MANAGER');
  });

  it('GET /api/auth/me - accepts standard 3-part JWT with seconds exp', async () => {
    const crypto = await import('crypto');
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: 'usr-01',
        email: 'hendra@berkasih.id',
        role: 'SUPER_ADMIN',
        exp: Math.floor(Date.now() / 1000) + 3600, // standard exp in seconds
      }),
    ).toString('base64url');
    const sig = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'smart-waste-secret-key-2026')
      .update(`${header}.${payload}`)
      .digest('base64url');
    const standardJwt = `${header}.${payload}.${sig}`;

    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${standardJwt}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('hendra@berkasih.id');
  });

  it('GET /api/auth/me - rejects truly expired token', async () => {
    const crypto = await import('crypto');
    const payload = Buffer.from(
      JSON.stringify({
        sub: 'USR-001',
        exp: Date.now() - 5000, // expired 5 seconds ago
      }),
    ).toString('base64url');
    const sig = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'smart-waste-secret-key-2026')
      .update(payload)
      .digest('base64url');
    const expiredToken = `${payload}.${sig}`;

    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Token tidak valid atau telah kedaluwarsa');
  });

  it('GET /api/auth/me - invalid or missing token returns 401', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('Hardening: rejects invalid email format with 400 Bad Request', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'invalid-email-format',
        password: 'password123',
      });

    expect(res.status).toBe(400);
  });

  it('Hardening: rejects short password (< 6 chars) with 400 Bad Request', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'hendra@berkasih.id',
        password: '123',
      });

    expect(res.status).toBe(400);
  });

  it('Hardening: locks account after 5 consecutive failed attempts', async () => {
    const targetEmail = 'rian.ops@berkasih.id';

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: targetEmail,
          password: 'wrong-password',
        });
    }

    // 6th attempt even with correct password should be rejected with 429 or 401 lock message
    const lockedRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: targetEmail,
        password: 'password123',
      });

    expect(lockedRes.status).toBe(429);
    expect(lockedRes.body.message).toContain('dikunci');
  });
});
