import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity.js';
import { Store } from '../stores/store.entity.js';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'product_id' })
  product_id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'jsonb', default: '{}' })
  attributes: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'price_override' })
  price_override: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'compare_at_price' })
  compare_at_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cost_price' })
  cost_price: number;

  @Column({ type: 'int', default: 0, name: 'stock_quantity' })
  stock_quantity: number;

  @Column({ type: 'int', default: 5, name: 'low_stock_threshold' })
  low_stock_threshold: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  image_url: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}
