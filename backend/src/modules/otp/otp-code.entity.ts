import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('otp_codes')
export class OtpCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['login', 'register', 'verify', 'reset_password'],
  })
  purpose: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
