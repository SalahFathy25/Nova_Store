import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  entity: string;

  @Column({ type: 'uuid', nullable: true, name: 'entity_id' })
  entity_id: string;

  @Column({ type: 'jsonb', nullable: true, name: 'old_values' })
  old_values: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, name: 'new_values' })
  new_values: Record<string, any>;

  @Column({ type: 'inet', nullable: true, name: 'ip_address' })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
