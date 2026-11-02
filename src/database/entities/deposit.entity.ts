import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('deposits')
export class Deposit {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  customer_id: string;

  @Column({ type: 'varchar' })
  operator_id: string;

  @Column({ type: 'varchar' })
  service_point_id: string;

  @Column({ type: 'varchar' })
  transaction_date: string;

  @Column({ type: 'float' })
  total_weight: number;

  @Column({ type: 'integer' })
  total_value: number;

  @Column({ type: 'varchar', default: 'VERIFIED' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;

  @Column({ type: 'simple-json' })
  details: any[];
}
