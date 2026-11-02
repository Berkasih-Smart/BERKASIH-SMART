import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class SalesService {
  constructor(private readonly dataSource: DataSource) {}

  async createSale(payload: any) {
    return this.dataSource.transaction(async (manager) => {
      const partner: any = await manager.getRepository('Partner').findOne({
        where: [{ id: payload.partner_id }],
      });

      if (!partner) {
        throw new NotFoundException('Partner not found.');
      }

      if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
        throw new BadRequestException('Sale must include at least 1 material item.');
      }

      let totalWeight = 0;
      let totalValue = 0;
      const validatedItems: any[] = [];

      for (const item of payload.items) {
        const inv: any = await manager.getRepository('Inventory').findOne({
          where: { waste_type_id: item.waste_type_id },
        });

        if (!inv) {
          throw new BadRequestException(`Material ${item.waste_type_id} does not exist in inventory.`);
        }

        const qty = parseFloat(item.weight_kg || item.quantity);
        if (isNaN(qty) || qty <= 0) {
          throw new BadRequestException('Sale quantity must be greater than 0.');
        }

        if (qty > inv.current_stock) {
          throw new BadRequestException(`Stock for ${inv.name} is insufficient. Available: ${inv.current_stock} kg, Requested: ${qty} kg.`);
        }

        const wasteType: any = await manager.getRepository('WasteType').findOne({
          where: { id: item.waste_type_id },
        });

        const rawPrice = item.price_per_kg ?? item.price ?? (wasteType ? wasteType.current_price_per_kg : 0);
        const price = parseFloat(rawPrice);
        const subtotal = Math.round(qty * (isNaN(price) ? 0 : price));

        totalWeight += qty;
        totalValue += subtotal;

        validatedItems.push({
          waste_type_id: item.waste_type_id,
          name: inv.name,
          weight_kg: qty,
          price_per_kg: price,
          subtotal,
        });

        // Deduct inventory
        inv.current_stock = parseFloat(((inv.current_stock || 0) - qty).toFixed(2));
        inv.outgoing_total = parseFloat(((inv.outgoing_total || 0) + qty).toFixed(2));
        await manager.getRepository('Inventory').save(inv);
      }

      totalWeight = parseFloat(totalWeight.toFixed(2));

      // Update partner metrics
      partner.total_purchased_kg = parseFloat(((partner.total_purchased_kg || 0) + totalWeight).toFixed(2));
      partner.total_transactions = (partner.total_transactions || 0) + 1;
      await manager.getRepository('Partner').save(partner);

      const now = new Date().toISOString();
      const count = await manager.getRepository('Sale').count();
      const saleId = `SAL-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const sale = manager.getRepository('Sale').create({
        id: saleId,
        partner_id: partner.id,
        partner_name: partner.name,
        sale_date: now,
        total_weight: totalWeight,
        total_value: totalValue,
        status: 'COMPLETED',
        payment_status: 'PAID',
        reference_invoice: `INV-OFFTAKER-${saleId}`,
        items: validatedItems,
        isDemo: false,
      });
      await manager.getRepository('Sale').save(sale);

      // Audit Log
      const auditLog = manager.getRepository('AuditLog').create({
        id: `AUD-${Date.now()}-${randomUUID().substring(0, 8)}`,
        user: payload.user?.name || 'Manager',
        role: payload.user?.role || 'MANAGER',
        action: 'CREATE_SALE',
        entity: 'SALES',
        entity_id: saleId,
        old_value: 'N/A',
        new_value: `Sale to ${partner.name}: ${totalWeight} kg, Rp${totalValue}`,
        timestamp: now,
        ip_address: '127.0.0.1 (Local Session)',
      });
      await manager.getRepository('AuditLog').save(auditLog);

      return {
        success: true,
        sale,
      };
    });
  }
}
