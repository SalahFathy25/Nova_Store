import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('users')
@Index(['tenant_id', 'email'], { unique: true })
@Index(['tenant_id', 'phone'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
  password_hash: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['customer', 'admin', 'driver', 'vendor_admin'],
  })
  role: string;

  @Column({ type: 'text', nullable: true, name: 'avatar_url' })
  avatar_url: string;

  @Column({ type: 'text', nullable: true, name: 'fcm_token' })
  fcm_token: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  is_verified: boolean;

  @Column({ type: 'varchar', length: 50, default: 'email', name: 'auth_provider' })
  auth_provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'provider_uid' })
  provider_uid: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' })
  last_login_at: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
