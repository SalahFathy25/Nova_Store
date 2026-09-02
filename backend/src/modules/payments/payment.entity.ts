import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParentOrder } from '../orders/parent-order.entity.js';
import { Store } from '../stores/store.entity.js';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  order_id: string;

  @ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: ParentOrder;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 50 })
  provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'transaction_id' })
  transaction_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'EGP' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: string;

  @Column({ type: 'jsonb', nullable: true, name: 'payment_method_details' })
  payment_method_details: Record<string, any>;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
