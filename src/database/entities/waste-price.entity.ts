import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('waste_prices')
export class WastePrice {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  waste_type_id: string;

  @Column({ type: 'integer' })
  price_per_kg: number;

  @Column({ type: 'varchar' })
  effective_date: string;

  @Column({ type: 'varchar', nullable: true })
  end_date?: string;

  @Column({ type: 'varchar' })
  changed_by: string;
}
