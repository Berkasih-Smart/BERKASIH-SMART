import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('pickups')
export class Pickup {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  customer_id: string;

  @Column({ type: 'varchar' })
  customer_name: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  rw: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'float', default: 0 })
  estimated_weight: number;

  @Column({ type: 'simple-json' })
  waste_types: string[];

  @Column({ type: 'varchar' })
  requested_date: string;

  @Column({ type: 'varchar', nullable: true })
  scheduled_date?: string;

  @Column({ type: 'varchar', nullable: true })
  assigned_operator?: string;

  @Column({ type: 'varchar', nullable: true })
  vehicle?: string;

  @Column({ type: 'varchar', default: 'REQUESTED' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;
}
