import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'varchar', default: 'INFO' })
  severity: string;
}
