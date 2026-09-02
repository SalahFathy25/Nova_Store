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
import { User } from '../users/user.entity.js';

@Entity('parent_orders')
@Index(['tenant_id', 'order_number'], { unique: true })
export class ParentOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'order_number' })
  order_number: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'uuid', name: 'customer_id' })
  customer_id: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'discount_amount' })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'shipping_fee' })
  shipping_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'tax_amount' })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'grand_total' })
  grand_total: number;

  @Column({ type: 'varchar', length: 50, name: 'payment_method' })
  payment_method: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending', name: 'payment_status' })
  payment_status: string;

  @Column({ type: 'jsonb', name: 'shipping_address' })
  shipping_address: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, name: 'billing_address' })
  billing_address: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'coupon_code' })
  coupon_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'coupon_discount' })
  coupon_discount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
