import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ai_insights')
export class AIInsight {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  evidence: string;

  @Column({ type: 'varchar' })
  interpretation: string;

  @Column({ type: 'varchar' })
  recommendation: string;

  @Column({ type: 'varchar' })
  confidence: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  created_at: string;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: string;
}
