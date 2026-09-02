import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { DeliveryShift } from './delivery-shift.entity.js';
import { Store } from '../stores/store.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';

@Entity('cash_ledger')
export class CashLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'driver_id' })
  driver_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'uuid', name: 'shift_id' })
  shift_id: string;

  @ManyToOne(() => DeliveryShift, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shift_id' })
  shift: DeliveryShift;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'uuid', nullable: true, name: 'sub_order_id' })
  sub_order_id: string;

  @ManyToOne(() => SubOrder, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'sub_order_id' })
  sub_order: SubOrder;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['collected', 'submitted', 'discrepancy', 'adjustment'],
  })
  type: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
