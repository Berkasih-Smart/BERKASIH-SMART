import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('End-to-End Workflow & Persistence Lifecycle', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('verifies that deposits persist across server restart', async () => {
    // 1. First Boot
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();

    // Reset to clean demo data
    await request(app.getHttpServer()).post('/api/system/reset-demo');

    // Fetch initial customer state
    const initialBoot = await request(app.getHttpServer()).get('/api/bootstrap');
    const initialCustomer = initialBoot.body.customers.find((c: any) => c.id === 'NSB-001');
    const initialBalance = initialCustomer.savings_balance;

    // 2. Submit new deposit
    const depositPayload = {
      customer_id: 'NSB-001',
      operator_id: 'usr-03',
      service_point_id: 'SP-01',
      items: [
        {
          waste_type_id: 'WST-001',
          weight: 15,
          price_per_kg: 3500,
        },
      ],
      notes: 'Persistence Lifecycle Test',
      user: { name: 'Rian Prasetyo', role: 'OPERATOR' },
    };

    const depRes = await request(app.getHttpServer())
      .post('/api/deposits')
      .send(depositPayload);

    expect(depRes.status).toBe(201);
    const expectedValue = 15 * 3500;
    const expectedNewBalance = initialBalance + expectedValue;

    // 3. Simulate Server Restart: Close current instance
    await app.close();

    // 4. Second Boot: Start new server instance connecting to the same database.sqlite
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();

    // 5. Verify data persisted in SQLite
    const postRestartBoot = await request(app.getHttpServer()).get('/api/bootstrap');
    const postRestartCustomer = postRestartBoot.body.customers.find((c: any) => c.id === 'NSB-001');

    expect(postRestartCustomer.savings_balance).toBe(expectedNewBalance);

    const savedDeposit = postRestartBoot.body.deposits.find(
      (d: any) => d.notes === 'Persistence Lifecycle Test',
    );
    expect(savedDeposit).toBeDefined();
    expect(savedDeposit.total_weight).toBe(15);
    expect(savedDeposit.total_value).toBe(expectedValue);
  });
});
