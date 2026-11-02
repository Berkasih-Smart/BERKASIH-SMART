import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', unique: true })
  customer_code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  rw_id: string;

  @Column({ type: 'varchar' })
  rt_id: string;

  @Column({ type: 'varchar' })
  join_date: string;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: string;

  @Column({ type: 'float', default: 0 })
  total_weight: number;

  @Column({ type: 'integer', default: 0 })
  savings_balance: number;

  @Column({ type: 'varchar', nullable: true })
  last_deposit_date?: string;

  @Column({ type: 'integer', default: 0 })
  deposit_count: number;

  @Column({ type: 'varchar', nullable: true })
  dominant_waste?: string;

  @Column({ type: 'varchar', default: 'STANDARD' })
  privacy_level: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;
}
