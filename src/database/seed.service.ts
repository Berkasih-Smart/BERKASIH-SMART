import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { hashPassword } from '../modules/auth/auth.utils';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.seedIfNeeded();
  }

  loadInitialData() {
    const seedPath = path.join(process.cwd(), 'public', 'js', 'db', 'initial_data.js');
    const content = fs.readFileSync(seedPath, 'utf8');
    const cleaned = content.replace(/export\s+const\s+INITIAL_DATA\s*=/, 'return');
    const fn = new Function(cleaned);
    return fn();
  }

  async seedIfNeeded() {
    const userRepo = this.dataSource.getRepository('User');
    const count = await userRepo.count();
    if (count > 0) {
      return;
    }
    await this.runSeed();
  }

  async runSeed() {
    const initialData = await this.loadInitialData();

    await this.dataSource.transaction(async (manager) => {
      // Clear existing records if any
      const tableNames = [
        'users',
        'rw',
        'service_points',
        'waste_types',
        'waste_prices',
        'customers',
        'deposits',
        'savings_transactions',
        'withdrawals',
        'inventory',
        'partners',
        'sales',
        'pickups',
        'programs',
        'ai_insights',
        'ai_alerts',
        'notifications',
        'audit_logs',
      ];

      for (const table of tableNames) {
        await manager.query(`DELETE FROM ${table}`);
      }

      // Insert entities
      if (initialData.users?.length) {
        const usersWithPasswords = initialData.users.map((u: any) => {
          const { hash, salt } = hashPassword('password123');
          return { ...u, password_hash: hash, salt };
        });
        await manager.getRepository('User').save(usersWithPasswords);
      }
      if (initialData.rw?.length) await manager.getRepository('RW').save(initialData.rw);
      if (initialData.service_points?.length) await manager.getRepository('ServicePoint').save(initialData.service_points);
      if (initialData.waste_types?.length) await manager.getRepository('WasteType').save(initialData.waste_types);
      if (initialData.waste_prices?.length) await manager.getRepository('WastePrice').save(initialData.waste_prices);
      if (initialData.customers?.length) await manager.getRepository('Customer').save(initialData.customers);
      if (initialData.deposits?.length) await manager.getRepository('Deposit').save(initialData.deposits);
      if (initialData.savings_transactions?.length) await manager.getRepository('SavingsTransaction').save(initialData.savings_transactions);
      if (initialData.withdrawals?.length) await manager.getRepository('Withdrawal').save(initialData.withdrawals);
      if (initialData.inventory?.length) await manager.getRepository('Inventory').save(initialData.inventory);
      if (initialData.partners?.length) await manager.getRepository('Partner').save(initialData.partners);
      if (initialData.sales?.length) await manager.getRepository('Sale').save(initialData.sales);
      if (initialData.pickups?.length) await manager.getRepository('Pickup').save(initialData.pickups);
      if (initialData.programs?.length) await manager.getRepository('Program').save(initialData.programs);
      if (initialData.ai_insights?.length) await manager.getRepository('AIInsight').save(initialData.ai_insights);
      if (initialData.ai_alerts?.length) await manager.getRepository('AIAlert').save(initialData.ai_alerts);
      if (initialData.notifications?.length) await manager.getRepository('Notification').save(initialData.notifications);
      if (initialData.audit_logs?.length) await manager.getRepository('AuditLog').save(initialData.audit_logs);
    });
  }
}
