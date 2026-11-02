import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    await request(app.getHttpServer()).post('/api/system/reset-demo');
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

  it('GET /api/auth/me - invalid or missing token returns 401', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/me');

    expect(res.status).toBe(401);
  });
});
