import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';

@Entity('vendor_payouts')
export class VendorPayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'vendor_id' })
  vendor_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'commission_deducted' })
  commission_deducted: number;

  @Column({ type: 'jsonb' })
  orders: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'payout_method' })
  payout_method: string;

  @Column({ type: 'jsonb', nullable: true, name: 'payout_details' })
  payout_details: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true, name: 'processed_at' })
  processed_at: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
