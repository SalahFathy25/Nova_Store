import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('coupons')
@Index(['tenant_id', 'code'], { unique: true })
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['percentage', 'fixed', 'free_shipping', 'bogo'],
  })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'minimum_order' })
  minimum_order: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'maximum_discount' })
  maximum_discount: number;

  @Column({ type: 'int', nullable: true, name: 'usage_limit' })
  usage_limit: number;

  @Column({ type: 'int', default: 1, name: 'usage_limit_per_user' })
  usage_limit_per_user: number;

  @Column({ type: 'int', default: 0, name: 'current_usage' })
  current_usage: number;

  @Column({ type: 'uuid', array: true, nullable: true, name: 'applicable_products' })
  applicable_products: string[];

  @Column({ type: 'uuid', array: true, nullable: true, name: 'applicable_categories' })
  applicable_categories: string[];

  @Column({ type: 'timestamptz', nullable: true, name: 'starts_at' })
  starts_at: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'expires_at' })
  expires_at: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
