import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DepositsService {
  constructor(private readonly dataSource: DataSource) {}

  async createDeposit(payload: any) {
    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.getRepository('Customer').findOne({
        where: [{ id: payload.customer_id }, { customer_code: payload.customer_id }],
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${payload.customer_id} not found.`);
      }

      if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
        throw new BadRequestException('Deposit must include at least 1 waste item.');
      }

      let totalWeight = 0;
      let totalValue = 0;
      const validatedDetails: any[] = [];

      for (const item of payload.items) {
        const weight = parseFloat(item.weight);
        if (isNaN(weight) || weight <= 0) {
          throw new BadRequestException('Waste weight must be greater than 0.');
        }

        const wasteType = await manager.getRepository('WasteType').findOne({
          where: { id: item.waste_type_id },
        });

        if (!wasteType) {
          throw new BadRequestException(`Waste type ${item.waste_type_id} is invalid.`);
        }

        const price = parseFloat(item.price_per_kg || (wasteType as any).current_price_per_kg);
        const subtotal = Math.round(weight * price);

        totalWeight += weight;
        totalValue += subtotal;

        validatedDetails.push({
          waste_type_id: (wasteType as any).id,
          waste_name: (wasteType as any).name,
          weight: parseFloat(weight.toFixed(2)),
          price_per_kg: price,
          subtotal,
        });
      }

      totalWeight = parseFloat(totalWeight.toFixed(2));
      const now = new Date().toISOString();
      const depositCount = await manager.getRepository('Deposit').count();
      const depositId = `DEP-${new Date().getFullYear()}-${String(depositCount + 1).padStart(3, '0')}`;

      // 1. Create Deposit
      const deposit = manager.getRepository('Deposit').create({
        id: depositId,
        customer_id: (customer as any).id,
        operator_id: payload.operator_id || 'usr-03',
        service_point_id: payload.service_point_id || 'SP-01',
        transaction_date: now,
        total_weight: totalWeight,
        total_value: totalValue,
        status: 'COMPLETED',
        notes: payload.notes || 'Setoran loket reguler',
        isDemo: false,
        details: validatedDetails,
      });
      await manager.getRepository('Deposit').save(deposit);

      // 2. Financial Update: Customer savings
      const oldBalance = (customer as any).savings_balance || 0;
      const newBalance = oldBalance + totalValue;

      (customer as any).savings_balance = newBalance;
      (customer as any).total_weight = parseFloat((((customer as any).total_weight || 0) + totalWeight).toFixed(2));
      (customer as any).last_deposit_date = now.slice(0, 10);
      (customer as any).deposit_count = ((customer as any).deposit_count || 0) + 1;
      (customer as any).status = 'ACTIVE';
      await manager.getRepository('Customer').save(customer);

      // 3. Savings Transaction Ledger Record
      const savingsTx = manager.getRepository('SavingsTransaction').create({
        id: `TX-SAV-${Date.now().toString().slice(-6)}`,
        customer_id: (customer as any).id,
        transaction_type: 'DEPOSIT',
        amount: totalValue,
        reference_id: depositId,
        transaction_date: now,
        balance_before: oldBalance,
        balance_after: newBalance,
        description: `Hasil setoran sampah ${depositId} (${totalWeight} kg)`,
        isDemo: false,
      });
      await manager.getRepository('SavingsTransaction').save(savingsTx);

      // 4. Inventory Stock Update
      for (const item of validatedDetails) {
        let invItem: any = await manager.getRepository('Inventory').findOne({
          where: { waste_type_id: item.waste_type_id },
        });

        if (!invItem) {
          invItem = manager.getRepository('Inventory').create({
            waste_type_id: item.waste_type_id,
            name: item.waste_name,
            current_stock: 0,
            incoming_total: 0,
            outgoing_total: 0,
            min_threshold: 50,
            max_capacity: 800,
            status: 'Healthy',
          });
        }

        invItem.current_stock = parseFloat(((invItem.current_stock || 0) + item.weight).toFixed(2));
        invItem.incoming_total = parseFloat(((invItem.incoming_total || 0) + item.weight).toFixed(2));

        if (invItem.current_stock >= invItem.max_capacity * 0.9) {
          invItem.status = 'Critical';
        } else if (invItem.current_stock >= invItem.max_capacity * 0.75) {
          invItem.status = 'Warning';
        } else {
          invItem.status = 'Healthy';
        }

        await manager.getRepository('Inventory').save(invItem);
      }

      // 5. Audit Log
      const auditLog = manager.getRepository('AuditLog').create({
        id: `AUD-${Date.now().toString().slice(-6)}`,
        user: payload.user?.name || 'Operator',
        role: payload.user?.role || 'OPERATOR',
        action: 'CREATE_DEPOSIT',
        entity: 'DEPOSITS',
        entity_id: depositId,
        old_value: 'N/A',
        new_value: `Deposit ${totalWeight} kg, Value Rp${totalValue}`,
        timestamp: now,
        ip_address: '127.0.0.1 (Local Session)',
      });
      await manager.getRepository('AuditLog').save(auditLog);

      return {
        success: true,
        deposit,
      };
    });
  }
}
