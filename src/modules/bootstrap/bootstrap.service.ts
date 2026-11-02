import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BootstrapService {
  constructor(private readonly dataSource: DataSource) {}

  async getSnapshot() {
    const [
      users,
      rw,
      service_points,
      waste_types,
      waste_prices,
      customers,
      deposits,
      savings_transactions,
      withdrawals,
      inventory,
      partners,
      sales,
      pickups,
      programs,
      ai_insights,
      ai_alerts,
      notifications,
      audit_logs,
    ] = await Promise.all([
      this.dataSource.getRepository('User').find(),
      this.dataSource.getRepository('RW').find(),
      this.dataSource.getRepository('ServicePoint').find(),
      this.dataSource.getRepository('WasteType').find(),
      this.dataSource.getRepository('WastePrice').find(),
      this.dataSource.getRepository('Customer').find(),
      this.dataSource.getRepository('Deposit').find(),
      this.dataSource.getRepository('SavingsTransaction').find(),
      this.dataSource.getRepository('Withdrawal').find(),
      this.dataSource.getRepository('Inventory').find(),
      this.dataSource.getRepository('Partner').find(),
      this.dataSource.getRepository('Sale').find(),
      this.dataSource.getRepository('Pickup').find(),
      this.dataSource.getRepository('Program').find(),
      this.dataSource.getRepository('AIInsight').find(),
      this.dataSource.getRepository('AIAlert').find(),
      this.dataSource.getRepository('Notification').find(),
      this.dataSource.getRepository('AuditLog').find(),
    ]);

    return {
      users,
      rw,
      service_points,
      waste_types,
      waste_prices,
      customers,
      deposits,
      savings_transactions,
      withdrawals,
      inventory,
      partners,
      sales,
      pickups,
      programs,
      ai_insights,
      ai_alerts,
      notifications,
      audit_logs,
    };
  }
}
