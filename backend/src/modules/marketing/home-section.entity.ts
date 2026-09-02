import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('home_sections')
export class HomeSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['banner', 'category_grid', 'product_list', 'product_grid', 'flash_sale', 'brands', 'custom'],
  })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'jsonb', default: '{}' })
  config: Record<string, any>;

  @Column({ type: 'int', default: 0, name: 'display_order' })
  display_order: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
