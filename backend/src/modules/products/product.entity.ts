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
import { Category } from '../categories/category.entity.js';
import { Brand } from '../brands/brand.entity.js';
import { User } from '../users/user.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'uuid', nullable: true, name: 'vendor_id' })
  vendor_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @Column({ type: 'uuid', nullable: true, name: 'category_id' })
  category_id: string;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'uuid', nullable: true, name: 'brand_id' })
  brand_id: string;

  @ManyToOne(() => Brand, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'short_description' })
  short_description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_price' })
  base_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'compare_at_price' })
  compare_at_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cost_price' })
  cost_price: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_featured' })
  is_featured: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_digital' })
  is_digital: boolean;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
