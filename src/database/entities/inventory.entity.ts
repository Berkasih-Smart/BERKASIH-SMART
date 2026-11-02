import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryColumn({ type: 'varchar' })
  waste_type_id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'float', default: 0 })
  current_stock: number;

  @Column({ type: 'float', default: 0 })
  incoming_total: number;

  @Column({ type: 'float', default: 0 })
  outgoing_total: number;

  @Column({ type: 'float', default: 0 })
  min_threshold: number;

  @Column({ type: 'float', default: 0 })
  max_capacity: number;

  @Column({ type: 'varchar', default: 'NORMAL' })
  status: string;
}
