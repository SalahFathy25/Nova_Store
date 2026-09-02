import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';

@Entity('driver_location_history')
@Index(['driver_id', 'created_at'])
@Index(['sub_order_id'])
export class DriverLocationHistory {
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

  @Column({ type: 'uuid', nullable: true, name: 'sub_order_id' })
  sub_order_id: string | null;

  @ManyToOne(() => SubOrder, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'sub_order_id' })
  sub_order: SubOrder;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  speed: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heading: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
