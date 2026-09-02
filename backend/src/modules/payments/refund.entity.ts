import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParentOrder } from '../orders/parent-order.entity.js';
import { Payment } from './payment.entity.js';
import { Store } from '../stores/store.entity.js';
import { User } from '../users/user.entity.js';

@Entity('refunds')
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  order_id: string;

  @ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: ParentOrder;

  @Column({ type: 'uuid', name: 'payment_id' })
  payment_id: string;

  @ManyToOne(() => Payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: string;

  @Column({ type: 'uuid', nullable: true, name: 'processed_by' })
  processed_by: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'processed_by' })
  processor: User;

  @Column({ type: 'timestamptz', nullable: true, name: 'processed_at' })
  processed_at: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
