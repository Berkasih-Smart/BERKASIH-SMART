import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  customer_id: string;

  @Column({ type: 'varchar' })
  customer_name: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'varchar', default: 'REQUESTED' })
  status: string;

  @Column({ type: 'varchar' })
  requested_at: string;

  @Column({ type: 'varchar', nullable: true })
  approved_at?: string;

  @Column({ type: 'varchar', nullable: true })
  completed_at?: string;

  @Column({ type: 'varchar', nullable: true })
  approved_by?: string;

  @Column({ type: 'varchar' })
  payout_method: string;

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;
}
