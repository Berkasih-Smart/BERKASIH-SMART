import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  partner_id: string;

  @Column({ type: 'varchar' })
  partner_name: string;

  @Column({ type: 'varchar' })
  sale_date: string;

  @Column({ type: 'float' })
  total_weight: number;

  @Column({ type: 'integer' })
  total_value: number;

  @Column({ type: 'varchar', default: 'COMPLETED' })
  status: string;

  @Column({ type: 'varchar', default: 'PAID' })
  payment_status: string;

  @Column({ type: 'varchar' })
  reference_invoice: string;

  @Column({ type: 'simple-json' })
  items: any[];

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;
}
