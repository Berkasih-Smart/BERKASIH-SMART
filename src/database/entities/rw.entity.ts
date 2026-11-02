import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('rw')
export class RW {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'integer' })
  population: number;

  @Column({ type: 'integer' })
  households: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'varchar' })
  coverage_status: string;

  @Column({ type: 'integer' })
  active_customers: number;
}
