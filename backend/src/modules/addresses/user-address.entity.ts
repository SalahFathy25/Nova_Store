import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 100, default: 'Home' })
  label: string;

  @Column({ type: 'text' })
  full_address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  building: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  floor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  apartment: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  landmark: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, default: 'EG' })
  country: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'postal_code' })
  postal_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'boolean', default: false, name: 'is_default' })
  is_default: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
