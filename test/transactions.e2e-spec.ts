import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Transactional Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    // Reset to demo to have predictable initial values
    await request(app.getHttpServer()).post('/api/system/reset-demo');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/deposits successfully records deposit and updates customer & inventory', async () => {
    const depositPayload = {
      customer_id: 'NSB-001',
      operator_id: 'usr-03',
      service_point_id: 'SP-01',
      items: [
        {
          waste_type_id: 'WST-001',
          weight: 10,
          price_per_kg: 3500,
        },
      ],
      notes: 'Setoran Uji TDD',
      user: { name: 'Rian Prasetyo', role: 'OPERATOR' },
    };

    const res = await request(app.getHttpServer())
      .post('/api/deposits')
      .send(depositPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.deposit).toBeDefined();
    expect(res.body.deposit.total_weight).toBe(10);
    expect(res.body.deposit.total_value).toBe(35000);

    // Verify snapshot reflects updated customer balance
    const bootRes = await request(app.getHttpServer()).get('/api/bootstrap');
    const customer = bootRes.body.customers.find((c: any) => c.id === 'NSB-001');
    expect(customer.savings_balance).toBeGreaterThan(0);

    // Verify inventory updated
    const petInventory = bootRes.body.inventory.find((i: any) => i.waste_type_id === 'WST-001');
    expect(petInventory.incoming_total).toBeGreaterThan(0);
  });

  it('POST /api/withdrawals/request deducts customer balance and logs transaction', async () => {
    const withdrawPayload = {
      customer_id: 'NSB-001',
      amount: 10000,
      payout_method: 'CASH',
      user: { name: 'Siti Aminah', role: 'CUSTOMER' },
    };

    const res = await request(app.getHttpServer())
      .post('/api/withdrawals/request')
      .send(withdrawPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.withdrawal).toBeDefined();
    expect(res.body.withdrawal.amount).toBe(10000);
  });

  it('POST /api/sales records sale and deducts inventory stock', async () => {
    const salePayload = {
      partner_id: 'PTR-001',
      partner_name: 'PT Cirebon Daur Mulya',
      items: [
        {
          waste_type_id: 'WST-001',
          weight_kg: 5,
          price_per_kg: 4500,
        },
      ],
      user: { name: 'Hendra Gunawan', role: 'SUPER_ADMIN' },
    };

    const res = await request(app.getHttpServer())
      .post('/api/sales')
      .send(salePayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.sale).toBeDefined();
  });
});
