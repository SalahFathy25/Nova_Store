import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @Column({ type: 'varchar', length: 255, name: 'refresh_token_hash' })
  refresh_token_hash: string;

  @Column({ type: 'jsonb', nullable: true, name: 'device_info' })
  device_info: Record<string, any>;

  @Column({ type: 'inet', nullable: true, name: 'ip_address' })
  ip_address: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expires_at: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
