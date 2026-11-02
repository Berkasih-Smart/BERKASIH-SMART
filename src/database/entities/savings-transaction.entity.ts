import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('savings_transactions')
export class SavingsTransaction {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  customer_id: string;

  @Column({ type: 'varchar' })
  transaction_type: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  reference_id?: string;

  @Column({ type: 'varchar' })
  transaction_date: string;

  @Column({ type: 'integer' })
  balance_before: number;

  @Column({ type: 'integer' })
  balance_after: number;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;
}
