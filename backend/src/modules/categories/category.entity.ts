import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  image_url: string;

  @Column({ type: 'uuid', nullable: true, name: 'parent_id' })
  parent_id: string;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @Column({ type: 'int', default: 0, name: 'display_order' })
  display_order: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_featured' })
  is_featured: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
