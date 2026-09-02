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

@Entity('delivery_shifts')
export class DeliveryShift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'driver_id' })
  driver_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 50, default: 'Offline' })
  status: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'started_at' })
  started_at: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'ended_at' })
  ended_at: Date;

  @Column({ type: 'int', default: 0, name: 'total_orders' })
  total_orders: number;

  @Column({ type: 'int', default: 0, name: 'total_delivered' })
  total_delivered: number;

  @Column({ type: 'int', default: 0, name: 'total_failed' })
  total_failed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'total_earnings' })
  total_earnings: number;

  @Column({ type: 'jsonb', nullable: true, name: 'current_location' })
  current_location: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
