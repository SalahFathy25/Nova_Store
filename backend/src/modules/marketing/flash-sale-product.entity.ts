import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FlashSale } from './flash-sale.entity.js';
import { Product } from '../products/product.entity.js';

@Entity('flash_sale_products')
export class FlashSaleProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'flash_sale_id' })
  flash_sale_id: string;

  @ManyToOne(() => FlashSale, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flash_sale_id' })
  flash_sale: FlashSale;

  @Column({ type: 'uuid', name: 'product_id' })
  product_id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'flash_price' })
  flash_price: number;

  @Column({ type: 'int', default: 0, name: 'flash_stock' })
  flash_stock: number;

  @Column({ type: 'int', default: 0, name: 'sold_count' })
  sold_count: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
