import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('partners')
export class Partner {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  contact_person: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'simple-json' })
  accepted_materials: string[];

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: string;

  @Column({ type: 'float', default: 0 })
  total_purchased_kg: number;

  @Column({ type: 'varchar' })
  circularity_destination: string;

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;
}
