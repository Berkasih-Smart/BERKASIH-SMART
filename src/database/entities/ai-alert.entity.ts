import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ai_alerts')
export class AIAlert {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  severity: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  metric_value: string;

  @Column({ type: 'varchar' })
  action_label: string;

  @Column({ type: 'varchar' })
  target_module: string;
}
