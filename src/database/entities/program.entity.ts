import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('programs')
export class Program {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  objective: string;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'integer' })
  target_participants: number;

  @Column({ type: 'integer', default: 0 })
  actual_participants: number;

  @Column({ type: 'varchar', default: 'UPCOMING' })
  status: string;

  @Column({ type: 'float', default: 0 })
  impact_kg: number;

  @Column({ type: 'boolean', default: false })
  isDemo: boolean;
}
