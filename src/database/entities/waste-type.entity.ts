import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('waste_types')
export class WasteType {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  unit: string;

  @Column({ type: 'integer' })
  current_price_per_kg: number;

  @Column({ type: 'float' })
  co2_factor: number;

  @Column({ type: 'float' })
  water_factor: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
