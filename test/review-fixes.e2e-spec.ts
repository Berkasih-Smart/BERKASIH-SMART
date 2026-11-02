import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SeedService } from '../src/database/seed.service';

describe('Review Fixes Verification (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    await app.get(SeedService).runSeed();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Fix 1: Server must enforce official waste type price and reject client price spoofing', async () => {
    // Official WST-001 price in demo seed is 3500. Attacker tries to submit 999999.
    const res = await request(app.getHttpServer())
      .post('/api/deposits')
      .send({
        customer_id: 'NSB-001',
        operator_id: 'usr-03',
        service_point_id: 'SP-01',
        items: [
          {
            waste_type_id: 'WST-001',
            weight: 2,
            price_per_kg: 999999, // Spoofed price
          },
        ],
        notes: 'Price spoof test',
      });

    expect(res.status).toBe(201);
    // Total value must be 2 * 3500 = 7000, NOT 2 * 999999
    expect(res.body.deposit.total_value).toBe(7000);
  });

  it('Fix 2 & 3: POST /api/customers creates customer in SQLite and saves to database', async () => {
    const newCustomer = {
      name: 'Budi Santoso',
      phone: '081999888777',
      address: 'Jl. Pemuda No. 10',
      rw_id: 'RW-01',
      rt_id: '01',
    };

    const res = await request(app.getHttpServer())
      .post('/api/customers')
      .send(newCustomer);

    expect(res.status).toBe(201);
    expect(res.body.customer).toBeDefined();
    expect(res.body.customer.name).toBe('Budi Santoso');

    // Verify customer appears in bootstrap
    const bootRes = await request(app.getHttpServer()).get('/api/bootstrap');
    const found = bootRes.body.customers.find((c: any) => c.phone === '081999888777');
    expect(found).toBeDefined();
  });

  it('Fix 4: POST /api/sales increments partner.total_purchased_kg', async () => {
    const salePayload = {
      partner_id: 'PTR-001',
      items: [
        {
          waste_type_id: 'WST-001',
          weight_kg: 10,
        },
      ],
      user: { name: 'Manager' },
    };

    const beforeBoot = await request(app.getHttpServer()).get('/api/bootstrap');
    const partnerBefore = beforeBoot.body.partners.find((p: any) => p.id === 'PTR-001');
    const initialPurchased = partnerBefore.total_purchased_kg || 0;

    const res = await request(app.getHttpServer())
      .post('/api/sales')
      .send(salePayload);

    expect(res.status).toBe(201);

    const afterBoot = await request(app.getHttpServer()).get('/api/bootstrap');
    const partnerAfter = afterBoot.body.partners.find((p: any) => p.id === 'PTR-001');
    expect(partnerAfter.total_purchased_kg).toBe(initialPurchased + 10);
  });
});
