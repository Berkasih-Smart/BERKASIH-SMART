import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('service_points')
export class ServicePoint {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'integer' })
  capacity_kg: number;
}
