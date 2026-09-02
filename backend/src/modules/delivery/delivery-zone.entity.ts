import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('delivery_zones')
export class DeliveryZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb' })
  coordinates: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'radius_km' })
  radius_km: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'flat_fee' })
  flat_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'free_above' })
  free_above: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
