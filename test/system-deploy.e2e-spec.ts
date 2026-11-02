import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import * as http from 'http';
import { AppModule } from '../src/app.module';

describe('System Deployment Webhook (e2e)', () => {
  let app: INestApplication;
  let superAdminToken: string;
  let operatorToken: string;
  let mockWebhookServer: http.Server;
  let mockWebhookPort: number;
  let webhookCalled = false;

  beforeAll(async () => {
    // Spin up mock aaPanel webhook server
    mockWebhookServer = http.createServer((req, res) => {
      webhookCalled = true;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: true, msg: 'Successful call' }));
    });

    await new Promise<void>((resolve) => {
      mockWebhookServer.listen(0, () => {
        const addr: any = mockWebhookServer.address();
        mockWebhookPort = addr.port;
        resolve();
      });
    });

    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();

    // Login as Super Admin (Hendra Wijaya)
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'hendra@berkasih.id', password: 'password123' });
    superAdminToken = adminLogin.body.token;

    // Login as Operator (Rian Prasetyo)
    const opLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'rian.ops@berkasih.id', password: 'password123' });
    operatorToken = opLogin.body.token;
  });

  afterAll(async () => {
    if (app) await app.close();
    if (mockWebhookServer) {
      await new Promise<void>((resolve) => mockWebhookServer.close(() => resolve()));
    }
  });

  it('rejects trigger-deploy if no authorization token provided (401)', async () => {
    const res = await request(app.getHttpServer()).post('/api/system/trigger-deploy');
    expect(res.status).toBe(401);
  });

  it('rejects trigger-deploy if user role is not SUPER_ADMIN (403)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/system/trigger-deploy')
      .set('Authorization', `Bearer ${operatorToken}`);

    expect(res.status).toBe(403);
  });

  it('fails if AAPANEL_WEBHOOK_URL is not configured (400)', async () => {
    const originalEnv = process.env.AAPANEL_WEBHOOK_URL;
    delete process.env.AAPANEL_WEBHOOK_URL;

    const res = await request(app.getHttpServer())
      .post('/api/system/trigger-deploy')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('AAPANEL_WEBHOOK_URL');

    process.env.AAPANEL_WEBHOOK_URL = originalEnv;
  });

  it('successfully triggers deploy webhook for SUPER_ADMIN (200)', async () => {
    process.env.AAPANEL_WEBHOOK_URL = `http://127.0.0.1:${mockWebhookPort}/hook?access_key=test&site_id=6`;

    webhookCalled = false;
    const res = await request(app.getHttpServer())
      .post('/api/system/trigger-deploy')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(webhookCalled).toBe(true);
    expect(res.body.message).toContain('berhasil');
  });
});
