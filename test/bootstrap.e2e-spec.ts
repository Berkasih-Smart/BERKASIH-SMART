import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Bootstrap & System Reset (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/bootstrap returns snapshot of all entities', async () => {
    const res = await request(app.getHttpServer()).get('/api/bootstrap');
    expect(res.status).toBe(200);
    const data = res.body;

    expect(Array.isArray(data.users)).toBe(true);
    expect(data.users.length).toBeGreaterThan(0);

    expect(Array.isArray(data.customers)).toBe(true);
    expect(data.customers.length).toBeGreaterThan(0);

    expect(Array.isArray(data.waste_types)).toBe(true);
    expect(data.waste_types.length).toBeGreaterThan(0);

    expect(Array.isArray(data.inventory)).toBe(true);
    expect(data.inventory.length).toBeGreaterThan(0);

    expect(Array.isArray(data.rw)).toBe(true);
    expect(Array.isArray(data.service_points)).toBe(true);
  });

  it('POST /api/system/reset-demo resets database to verified demo seed', async () => {
    const res = await request(app.getHttpServer()).post('/api/system/reset-demo');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
