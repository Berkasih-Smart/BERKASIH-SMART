import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class WithdrawalsService {
  constructor(private readonly dataSource: DataSource) {}

  async requestWithdrawal(payload: any) {
    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.getRepository('Customer').findOne({
        where: [{ id: payload.customer_id }, { customer_code: payload.customer_id }],
      });

      if (!customer) {
        throw new NotFoundException('Customer not found.');
      }

      const withdrawAmount = parseInt(payload.amount, 10);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new BadRequestException('Invalid withdrawal amount.');
      }

      if (withdrawAmount > (customer as any).savings_balance) {
        throw new BadRequestException(`Insufficient balance. Current balance: Rp${(customer as any).savings_balance}`);
      }

      const now = new Date().toISOString();
      const count = await manager.getRepository('Withdrawal').count();
      const wdrId = `WDR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const withdrawal = manager.getRepository('Withdrawal').create({
        id: wdrId,
        customer_id: (customer as any).id,
        customer_name: (customer as any).name,
        amount: withdrawAmount,
        status: 'REQUESTED',
        requested_at: now,
        payout_method: payload.payout_method || 'CASH',
        isDemo: false,
      });
      await manager.getRepository('Withdrawal').save(withdrawal);

      // Audit Log
      const auditLog = manager.getRepository('AuditLog').create({
        id: `AUD-${Date.now().toString().slice(-6)}`,
        user: payload.user?.name || (customer as any).name,
        role: payload.user?.role || 'CUSTOMER',
        action: 'REQUEST_WITHDRAWAL',
        entity: 'WITHDRAWALS',
        entity_id: wdrId,
        old_value: `Current Balance: Rp${(customer as any).savings_balance}`,
        new_value: `Requested: Rp${withdrawAmount}`,
        timestamp: now,
        ip_address: '127.0.0.1 (Local Session)',
      });
      await manager.getRepository('AuditLog').save(auditLog);

      return {
        success: true,
        withdrawal,
      };
    });
  }

  async completeWithdrawal(id: string, payload: any) {
    return this.dataSource.transaction(async (manager) => {
      const wdr: any = await manager.getRepository('Withdrawal').findOne({ where: { id } });
      if (!wdr) throw new NotFoundException('Withdrawal not found.');
      if (wdr.status === 'COMPLETED') throw new BadRequestException('Withdrawal already completed.');

      const customer: any = await manager.getRepository('Customer').findOne({ where: { id: wdr.customer_id } });
      if (!customer) throw new NotFoundException('Customer not found.');

      if (customer.savings_balance < wdr.amount) {
        throw new BadRequestException(`Customer balance insufficient: Rp${customer.savings_balance}`);
      }

      const now = new Date().toISOString();
      const oldBalance = customer.savings_balance;
      const newBalance = oldBalance - wdr.amount;

      customer.savings_balance = newBalance;
      await manager.getRepository('Customer').save(customer);

      wdr.status = 'COMPLETED';
      wdr.approved_at = now;
      wdr.completed_at = now;
      wdr.approved_by = payload?.user?.name || 'Manager';
      await manager.getRepository('Withdrawal').save(wdr);

      // Savings Transaction Ledger
      const savingsTx = manager.getRepository('SavingsTransaction').create({
        id: `TX-SAV-${Date.now().toString().slice(-6)}`,
        customer_id: customer.id,
        transaction_type: 'WITHDRAWAL',
        amount: wdr.amount,
        reference_id: wdr.id,
        transaction_date: now,
        balance_before: oldBalance,
        balance_after: newBalance,
        description: `Penarikan saldo tunai (${wdr.id}) disetujui`,
        isDemo: false,
      });
      await manager.getRepository('SavingsTransaction').save(savingsTx);

      // Audit Log
      const auditLog = manager.getRepository('AuditLog').create({
        id: `AUD-${Date.now().toString().slice(-6)}`,
        user: payload?.user?.name || 'Manager',
        role: payload?.user?.role || 'MANAGER',
        action: 'APPROVE_WITHDRAWAL',
        entity: 'WITHDRAWALS',
        entity_id: wdr.id,
        old_value: `Balance Before: Rp${oldBalance}`,
        new_value: `Completed: Rp${wdr.amount}, Balance After: Rp${newBalance}`,
        timestamp: now,
        ip_address: '127.0.0.1 (Local Session)',
      });
      await manager.getRepository('AuditLog').save(auditLog);

      return {
        success: true,
        withdrawal: wdr,
      };
    });
  }
}
