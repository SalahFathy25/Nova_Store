import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity.js';
import { User } from '../users/user.entity.js';
import { ParentOrder } from '../orders/parent-order.entity.js';

@Entity('coupon_usage')
export class CouponUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'coupon_id' })
  coupon_id: string;

  @ManyToOne(() => Coupon, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'order_id' })
  order_id: string;

  @ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: ParentOrder;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_amount' })
  discount_amount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
