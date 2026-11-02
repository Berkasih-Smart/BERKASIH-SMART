export * from './user.entity';
export * from './rw.entity';
export * from './service-point.entity';
export * from './waste-type.entity';
export * from './waste-price.entity';
export * from './customer.entity';
export * from './deposit.entity';
export * from './savings-transaction.entity';
export * from './withdrawal.entity';
export * from './inventory.entity';
export * from './partner.entity';
export * from './sale.entity';
export * from './pickup.entity';
export * from './program.entity';
export * from './ai-insight.entity';
export * from './ai-alert.entity';
export * from './notification.entity';
export * from './audit-log.entity';

import { User } from './user.entity';
import { RW } from './rw.entity';
import { ServicePoint } from './service-point.entity';
import { WasteType } from './waste-type.entity';
import { WastePrice } from './waste-price.entity';
import { Customer } from './customer.entity';
import { Deposit } from './deposit.entity';
import { SavingsTransaction } from './savings-transaction.entity';
import { Withdrawal } from './withdrawal.entity';
import { Inventory } from './inventory.entity';
import { Partner } from './partner.entity';
import { Sale } from './sale.entity';
import { Pickup } from './pickup.entity';
import { Program } from './program.entity';
import { AIInsight } from './ai-insight.entity';
import { AIAlert } from './ai-alert.entity';
import { Notification } from './notification.entity';
import { AuditLog } from './audit-log.entity';

export const ALL_ENTITIES = [
  User,
  RW,
  ServicePoint,
  WasteType,
  WastePrice,
  Customer,
  Deposit,
  SavingsTransaction,
  Withdrawal,
  Inventory,
  Partner,
  Sale,
  Pickup,
  Program,
  AIInsight,
  AIAlert,
  Notification,
  AuditLog,
];
