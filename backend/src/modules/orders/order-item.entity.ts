import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubOrder } from './sub-order.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'sub_order_id' })
  sub_order_id: string;

  @ManyToOne(() => SubOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_order_id' })
  sub_order: SubOrder;

  @Column({ type: 'uuid', name: 'product_id' })
  product_id: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'uuid', name: 'product_variant_id' })
  product_variant_id: string;

  @ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_variant_id' })
  product_variant: ProductVariant;

  @Column({ type: 'varchar', length: 255, name: 'product_title' })
  product_title: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'variant_title' })
  variant_title: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  total_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'discount_amount' })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'tax_amount' })
  tax_amount: number;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  image_url: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
