import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParentOrder } from './parent-order.entity.js';
import { User } from '../users/user.entity.js';

@Entity('sub_orders')
export class SubOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'parent_order_id' })
  parent_order_id: string;

  @ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_order_id' })
  parent_order: ParentOrder;

  @Column({ type: 'uuid', nullable: true, name: 'vendor_id' })
  vendor_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @Column({ type: 'uuid', nullable: true, name: 'driver_id' })
  driver_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'varchar', length: 50, default: 'Pending', name: 'order_status' })
  order_status: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending', name: 'payment_status' })
  payment_status: string;

  @Column({ type: 'varchar', length: 50, default: 'Unassigned', name: 'delivery_status' })
  delivery_status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'delivery_fee' })
  delivery_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'commission_amount' })
  commission_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'net_amount' })
  net_amount: number;

  @Column({ type: 'varchar', length: 6, name: 'delivery_otp' })
  delivery_otp: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'otp_expires_at' })
  otp_expires_at: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'estimated_delivery' })
  estimated_delivery: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'actual_delivery' })
  actual_delivery: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
