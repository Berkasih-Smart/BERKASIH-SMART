import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class CustomersService {
  constructor(private readonly dataSource: DataSource) {}

  async createCustomer(payload: any) {
    if (!payload.name || !payload.phone || !payload.rw_id) {
      throw new BadRequestException('Nama, nomor telepon, dan RW wajib diisi.');
    }

    return this.dataSource.transaction(async (manager) => {
      const existing = await manager.getRepository('Customer').findOne({
        where: { phone: payload.phone },
      });

      if (existing) {
        throw new BadRequestException(`Customer with phone ${payload.phone} already registered.`);
      }

      const count = await manager.getRepository('Customer').count();
      const id = payload.id || `NSB-${String(count + 1).padStart(3, '0')}`;
      const code = payload.customer_code || `CST-${new Date().getFullYear().toString().slice(-2)}${String(count + 1).padStart(3, '0')}`;
      const now = new Date().toISOString().slice(0, 10);

      const rw: any = await manager.getRepository('RW').findOne({
        where: { id: payload.rw_id },
      });

      const lat = rw ? rw.lat + (Math.random() - 0.5) * 0.003 : -6.7460;
      const lng = rw ? rw.lng + (Math.random() - 0.5) * 0.003 : 108.5370;

      const customer = manager.getRepository('Customer').create({
        id,
        customer_code: code,
        name: String(payload.name).trim(),
        phone: String(payload.phone).trim(),
        address: payload.address || 'Kelurahan Karyamulya',
        rw_id: payload.rw_id,
        rt_id: payload.rt_id || '01',
        join_date: now,
        status: 'ACTIVE',
        total_weight: 0,
        savings_balance: 0,
        last_deposit_date: null,
        deposit_count: 0,
        dominant_waste: 'Belum Ada',
        privacy_level: 'AGGREGATED',
        lat: parseFloat(lat.toFixed(5)),
        lng: parseFloat(lng.toFixed(5)),
        isDemo: false,
      });

      await manager.getRepository('Customer').save(customer);

      const auditLog = manager.getRepository('AuditLog').create({
        id: `AUD-${Date.now()}-${randomUUID().substring(0, 8)}`,
        user: payload.user?.name || 'Operator',
        role: payload.user?.role || 'OPERATOR',
        action: 'REGISTER_CUSTOMER',
        entity: 'CUSTOMERS',
        entity_id: id,
        old_value: 'N/A',
        new_value: `Registered ${customer.name} (${customer.customer_code})`,
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1 (Local Session)',
      });
      await manager.getRepository('AuditLog').save(auditLog);

      return {
        success: true,
        customer,
      };
    });
  }
}
