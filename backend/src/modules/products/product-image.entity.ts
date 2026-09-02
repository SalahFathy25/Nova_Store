import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity.js';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'product_id' })
  product_id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'alt_text' })
  alt_text: string;

  @Column({ type: 'int', default: 0, name: 'display_order' })
  display_order: number;

  @Column({ type: 'boolean', default: false, name: 'is_primary' })
  is_primary: boolean;

  @Column({ type: 'jsonb', nullable: true })
  variants: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
