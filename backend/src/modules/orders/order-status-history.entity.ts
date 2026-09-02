import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParentOrder } from './parent-order.entity.js';
import { SubOrder } from './sub-order.entity.js';
import { User } from '../users/user.entity.js';

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  order_id: string;

  @ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: ParentOrder;

  @Column({ type: 'uuid', nullable: true, name: 'sub_order_id' })
  sub_order_id: string;

  @ManyToOne(() => SubOrder, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'sub_order_id' })
  sub_order: SubOrder;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'from_status' })
  from_status: string;

  @Column({ type: 'varchar', length: 50, name: 'to_status' })
  to_status: string;

  @Column({ type: 'uuid', nullable: true, name: 'changed_by' })
  changed_by: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'changed_by' })
  changer: User;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
