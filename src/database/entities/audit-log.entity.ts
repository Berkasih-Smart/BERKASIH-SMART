import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  user: string;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar' })
  entity: string;

  @Column({ type: 'varchar' })
  entity_id: string;

  @Column({ type: 'varchar' })
  old_value: string;

  @Column({ type: 'varchar' })
  new_value: string;

  @Column({ type: 'varchar' })
  timestamp: string;

  @Column({ type: 'varchar' })
  ip_address: string;
}
