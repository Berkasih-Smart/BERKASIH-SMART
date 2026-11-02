import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Static Assets (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should serve index.html', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>');
  });

  it('GET /css/base.css should serve css stylesheet', async () => {
    const res = await request(app.getHttpServer()).get('/css/base.css');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('text/css');
  });

  it('GET /js/app.js should serve javascript module', async () => {
    const res = await request(app.getHttpServer()).get('/js/app.js');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toContain('application/javascript');
  });
});
