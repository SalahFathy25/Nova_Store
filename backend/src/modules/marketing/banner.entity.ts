import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', name: 'image_url' })
  image_url: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'link_type',
    enum: ['product', 'category', 'url', 'none'],
  })
  link_type: string;

  @Column({ type: 'text', nullable: true, name: 'link_value' })
  link_value: string;

  @Column({ type: 'varchar', length: 100, default: 'home_top' })
  position: string;

  @Column({ type: 'int', default: 0, name: 'display_order' })
  display_order: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'starts_at' })
  starts_at: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'expires_at' })
  expires_at: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
