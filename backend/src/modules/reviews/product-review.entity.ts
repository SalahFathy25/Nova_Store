import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from '../products/product.entity.js';
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';

@Entity('product_reviews')
@Index(['user_id', 'product_id', 'order_id'], { unique: true })
export class ProductReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'product_id' })
  product_id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'uuid', nullable: true, name: 'order_id' })
  order_id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column({ type: 'boolean', default: false, name: 'is_verified_purchase' })
  is_verified_purchase: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_approved' })
  is_approved: boolean;

  @Column({ type: 'int', default: 0, name: 'helpful_count' })
  helpful_count: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
